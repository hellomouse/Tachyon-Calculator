'use strict';

class PrecisionError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, PrecisionError)
    }
}

class TimeoutError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, TimeoutError)
    }
}

module.exports = {
    PrecisionError: PrecisionError,
    TimeoutError: TimeoutError
};