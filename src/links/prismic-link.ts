
import {
    RestLink
} from "apollo-link-rest";

import {
    setContext
} from "apollo-link-context";
import { ApolloLink } from "apollo-link";

type PrismicRestLinkOptions = {
    /* Your prismic access token */
    accessToken?: string;
    /* A custom fetch impl. to handle REST calls */
    customFetch?: (request: RequestInfo, init: RequestInit) => Promise<Response>;
    /* Your prismic repository name */
    repository: string;
}

// @ts-ignore
global.Headers = global.Headers || require("fetch-headers");

function PrismicRestLink(options: PrismicRestLinkOptions) {
    const { 
        accessToken,
        customFetch,
        repository
    } = options;

    const fetchapi = customFetch || fetch;
    const endpoint = getPrismicApiEndpoint(repository);

/*
    // grab prismic's api master ref before querying
    const context = setContext(async (_operation, _) => {
        const tokenurl = `${endpoint}?access_token=${accessToken}`;
        const response = await fetchapi(tokenurl, {
            headers: { Accept: 'application/json' }
        });

        const payload = await response.json();

        console.log("[payload abc] --", payload);

        return {
            headers: {
                "Accept": "random-str",
                masterRef: payload.refs.filter(
                    (ref: any) => ref.isMasterRef)[0]
            }
        };
    });
*/
    const restLink = new RestLink({
        uri: endpoint,
        headers: {
            Accept: "application/json"
        },
        customFetch: async (req, res) => {
            const tokenurl = `${endpoint}?access_token=${accessToken}`;
            const response = await fetchapi(tokenurl, {
                headers: { Accept: 'application/json' }
            });

            const payload = await response.json();

            const url = new URL(<string>req);
                  url.searchParams.append("access_token", accessToken ?? "");
                  url.searchParams.append("ref", payload.refs.filter((r: any) => r.isMasterRef)[0]?.ref);

            return await fetchapi(url.toString(), res);
        }
    });
    
    // combine the two links into one
    return restLink; // context.concat(restLink);
}

function getPrismicApiEndpoint(repository: string) {
    return `https://${repository}.cdn.prismic.io/api/v2`;
}

export {
    PrismicRestLink
};