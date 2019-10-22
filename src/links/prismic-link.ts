
import{
    RestLink
} from "apollo-link-rest";

import {
    setContext
} from "apollo-link-context";

type PrismicLinkOptions = {
    accessToken: string;
    repository: string;
    /* A custom fetch to handle REST calls */
    customFetch: any;
}

function PrismicLink(options: PrismicLinkOptions) {
    const { accessToken, repository } = options;
    const fetchapi = fetch || options.customFetch;
    const endpoint = getPrismicApiEndpoint(repository, accessToken);
    /*
    const prismic  = async () => await Prismic.getApi(endpoint, {
        accessToken: options.accessToken
    });
    */

    const context = setContext(async (_, context) => {
        // const api = await prismic();
        const response = await fetchapi(endpoint, {
            headers: { Accept: 'application/json' }
        });

        const masteref = await response.json();

        return {
            headers: {
                ...context.headers,
                "Prismic-Ref": masteref.masterRef.id,
                "Authorization": `Token ${options.accessToken}`
            }
        };
    });

    return context.concat(new RestLink({
        uri: endpoint,
        customFetch: options.customFetch
    }));
}

function getPrismicApiEndpoint(repository: string, accessToken: string) {
    return `https://${repository}.cdn.prismic.io/api/v2?access_token=${accessToken}`;
}

export {
    PrismicLink
};