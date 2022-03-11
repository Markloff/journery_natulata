"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const uri_1 = require("../../../../core/base/common/uri");
(0, mocha_1.suite)('uri', () => {
    (0, mocha_1.test)('append no hash url', () => {
        const url = 'https://test.com?foo=1&bar=2#route';
        const date = Date.now();
        const uri = uri_1.URI.appendParams(url, {
            _: date,
        });
        const newUri = uri_1.URI.parse(uri);
        assert_1.default.strictEqual(newUri.query, `foo=1&bar=2&_=${date}`);
    });
});
