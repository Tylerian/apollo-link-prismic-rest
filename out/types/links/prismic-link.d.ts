import { RestLink } from "apollo-link-rest";
declare type PrismicRestLinkOptions = {
    accessToken?: string;
    customFetch?: (request: RequestInfo, init: RequestInit) => Promise<Response>;
    repository: string;
};
declare function PrismicRestLink(options: PrismicRestLinkOptions): RestLink;
export { PrismicRestLink };
