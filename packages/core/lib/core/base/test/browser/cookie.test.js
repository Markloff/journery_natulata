"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const cookie_1 = require("../../../../core/base/browser/cookie");
const assert_1 = __importDefault(require("assert"));
(0, mocha_1.suite)('cookie', () => {
    (0, mocha_1.test)('set cookie and get cookie', () => {
        cookie_1.Cookie.set('uin', '2366973315');
        assert_1.default.strictEqual(cookie_1.Cookie.get('uin'), '2366973315');
    });
    (0, mocha_1.test)('set cookie and delete cookie', () => {
        cookie_1.Cookie.set('uin', '2366973315');
        cookie_1.Cookie.deleteCookie('uin');
        assert_1.default.strictEqual(cookie_1.Cookie.get('uin'), undefined);
    });
});
