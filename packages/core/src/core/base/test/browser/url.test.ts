import { suite, test } from 'mocha';
import assert from "assert";
import { URI } from "@/core/base/common/uri";

suite('uri', () => {

	test('append no hash url', () => {

		const url = 'https://test.com?foo=1&bar=2#route';
		const date = Date.now();
		const uri = URI.appendParams(url,{
			_: date,
		});
		const newUri = URI.parse(uri);
		assert.strictEqual(newUri.query, `foo=1&bar=2&_=${date}`);
	});


});
