"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("./Errors");
const HttpClient_1 = require("./HttpClient");
const XhrHttpClient_1 = require("./XhrHttpClient");
let nodeHttpClientModule;
if (typeof XMLHttpRequest === "undefined") {
    // In order to ignore the dynamic require in webpack builds we need to do this magic
    // @ts-ignore: TS doesn't know about these names
    const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    nodeHttpClientModule = requireFunc("./NodeHttpClient");
}
/** Default implementation of {@link @aspnet/signalr.HttpClient}. */
class DefaultHttpClient extends HttpClient_1.HttpClient {
    /** Creates a new instance of the {@link @aspnet/signalr.DefaultHttpClient}, using the provided {@link @aspnet/signalr.ILogger} to log messages. */
    constructor(logger) {
        super();
        if (typeof XMLHttpRequest !== "undefined") {
            this.httpClient = new XhrHttpClient_1.XhrHttpClient(logger);
        }
        else if (typeof nodeHttpClientModule !== "undefined") {
            this.httpClient = new nodeHttpClientModule.NodeHttpClient(logger);
        }
        else {
            throw new Error("No HttpClient could be created.");
        }
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new Errors_1.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return this.httpClient.send(request);
    }
    getCookieString(url) {
        return this.httpClient.getCookieString(url);
    }
}
exports.DefaultHttpClient = DefaultHttpClient;
