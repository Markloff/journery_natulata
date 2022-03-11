import { suite, test } from 'mocha';
import { Cookie } from "@/core/base/browser/cookie";
import assert from "assert";

suite('cookie', () => {

	test('set cookie and get cookie', () => {
		Cookie.set('uin', '2366973315');
		assert.strictEqual(Cookie.get('uin'), '2366973315');
	});

	test('set cookie and delete cookie', () => {
		Cookie.set('uin', '2366973315');
		Cookie.deleteCookie('uin');
		assert.strictEqual(Cookie.get('uin'), undefined);
	});

});
