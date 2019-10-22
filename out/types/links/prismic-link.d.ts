declare type PrismicRestLinkOptions = {
    accessToken: string;
    repository: string;
    customFetch?: any;
};
declare function PrismicRestLink(options: PrismicRestLinkOptions): import("apollo-link").ApolloLink;
export { PrismicRestLink };
