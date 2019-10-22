'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var apolloLinkRest = require('apollo-link-rest');

var _a;
// load Headers polyfill if needed
// TODO: This may be placed in consumer's code...
if (typeof window === "undefined" ||
    typeof ((_a = window) === null || _a === void 0 ? void 0 : _a.Headers) === "undefined") {
    // @ts-ignore
    global.Headers = global.Headers || require("fetch-headers");
}
function PrismicRestLink(options) {
    var _this = this;
    var _a = options.accessToken, accessToken = _a === void 0 ? "" : _a, customFetch = options.customFetch, repository = options.repository;
    var fetchapi = customFetch || fetch;
    var endpoint = getPrismicApiEndpoint(repository);
    return new apolloLinkRest.RestLink({
        uri: endpoint,
        headers: {
            Accept: "application/json"
        },
        customFetch: function (req, res) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var authdurl, response, payload, ref, url;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authdurl = endpoint + "?access_token=" + accessToken;
                        return [4 /*yield*/, fetchapi(authdurl, {
                                headers: { Accept: 'application/json' }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        payload = _a.sent();
                        ref = getMasterRef(payload.refs);
                        url = new URL(req);
                        url.searchParams.append("access_token", accessToken);
                        url.searchParams.append("ref", ref);
                        return [4 /*yield*/, fetchapi("" + url, res)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    });
}
function getMasterRef(refs) {
    var _a;
    return (_a = refs.filter(function (ref) { return ref.isMasterRef; })[0]) === null || _a === void 0 ? void 0 : _a.ref;
}
function getPrismicApiEndpoint(repository) {
    return "https://" + repository + ".cdn.prismic.io/api/v2";
}

exports.PrismicRestLink = PrismicRestLink;
