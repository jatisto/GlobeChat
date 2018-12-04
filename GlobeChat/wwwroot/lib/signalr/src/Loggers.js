"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/** A logger that does nothing when log messages are sent to it. */
class NullLogger {
    constructor() { }
    /** @inheritDoc */
    // tslint:disable-next-line
    log(_logLevel, _message) {
    }
}
/** The singleton instance of the {@link @aspnet/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();
exports.NullLogger = NullLogger;
