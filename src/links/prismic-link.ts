import {
    RestLink
} from "apollo-link-rest";

type PrismicRestLinkOptions = {
    /* Your prismic access token */
    accessToken?: string;
    /* A custom fetch impl. to handle REST calls */
    customFetch?: (request: RequestInfo, init: RequestInit) => Promise<Response>;
    /* Your prismic repository name */
    repository: string;
}

// load Headers polyfill if needed
// TODO: This may be placed in consumer's code...
if (typeof window === "undefined" || 
    typeof window?.Headers === "undefined") {
    // @ts-ignore
    global.Headers = global.Headers || require("fetch-headers");
}

function PrismicRestLink(options: PrismicRestLinkOptions) {
    const { 
        accessToken = "",
        customFetch,
        repository
    } = options;

    const fetchapi = customFetch || fetch;
    const endpoint = getPrismicApiEndpoint(repository);

    return new RestLink({
        uri: endpoint,
        headers: {
            Accept: "application/json"
        },
        customFetch: async (req, res) => {
            const authdurl = `${endpoint}?access_token=${accessToken}`;
            const response = await fetchapi(authdurl, {
                headers: { Accept: 'application/json' }
            });

            const payload = await response.json();

            const ref = getMasterRef(payload.refs);
            const url = new URL(<string>req);
            
            url.searchParams.append("access_token", accessToken);
            url.searchParams.append("ref", ref);

            return await fetchapi(`${url}`, res);
        }
    });
}

function getMasterRef(refs: any[]) {
    return refs.filter((ref: any) => ref.isMasterRef)[0]?.ref;
}

function getPrismicApiEndpoint(repository: string) {
    return `https://${repository}.cdn.prismic.io/api/v2`;
}

export {
    PrismicRestLink
};