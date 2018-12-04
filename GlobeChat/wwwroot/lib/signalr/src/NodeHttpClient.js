"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request = __importStar(require("request"));
const Errors_1 = require("./Errors");
const HttpClient_1 = require("./HttpClient");
const ILogger_1 = require("./ILogger");
const Utils_1 = require("./Utils");
class NodeHttpClient extends HttpClient_1.HttpClient {
    constructor(logger) {
        super();
        this.logger = logger;
        this.cookieJar = Request.jar();
        this.request = Request.defaults({ jar: this.cookieJar });
    }
    send(httpRequest) {
        return new Promise((resolve, reject) => {
            let requestBody;
            if (Utils_1.isArrayBuffer(httpRequest.content)) {
                requestBody = Buffer.from(httpRequest.content);
            }
            else {
                requestBody = httpRequest.content || "";
            }
            const currentRequest = this.request(httpRequest.url, {
                body: requestBody,
                // If binary is expected 'null' should be used, otherwise for text 'utf8'
                encoding: httpRequest.responseType === "arraybuffer" ? null : "utf8",
                headers: Object.assign({ 
                    // Tell auth middleware to 401 instead of redirecting
                    "X-Requested-With": "XMLHttpRequest" }, httpRequest.headers),
                method: httpRequest.method,
                timeout: httpRequest.timeout,
            }, (error, response, body) => {
                if (httpRequest.abortSignal) {
                    httpRequest.abortSignal.onabort = null;
                }
                if (error) {
                    if (error.code === "ETIMEDOUT") {
                        this.logger.log(ILogger_1.LogLevel.Warning, `Timeout from HTTP request.`);
                        reject(new Errors_1.TimeoutError());
                    }
                    this.logger.log(ILogger_1.LogLevel.Warning, `Error from HTTP request. ${error}`);
                    reject(error);
                    return;
                }
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(new HttpClient_1.HttpResponse(response.statusCode, response.statusMessage || "", body));
                }
                else {
                    reject(new Errors_1.HttpError(response.statusMessage || "", response.statusCode || 0));
                }
            });
            if (httpRequest.abortSignal) {
                httpRequest.abortSignal.onabort = () => {
                    currentRequest.abort();
                    reject(new Errors_1.AbortError());
                };
            }
        });
    }
    getCookieString(url) {
        return this.cookieJar.getCookieString(url);
    }
}
exports.NodeHttpClient = NodeHttpClient;
