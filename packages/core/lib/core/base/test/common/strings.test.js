"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const assert_1 = __importDefault(require("assert"));
const strings = __importStar(require("../../../../core/base/common/strings"));
const mocha_1 = require("mocha");
(0, mocha_1.suite)('Strings', () => {
    (0, mocha_1.test)('equalsIgnoreCase', () => {
        (0, assert_1.default)(strings.equalsIgnoreCase('', ''));
        (0, assert_1.default)(!strings.equalsIgnoreCase('', '1'));
        (0, assert_1.default)(!strings.equalsIgnoreCase('1', ''));
        (0, assert_1.default)(strings.equalsIgnoreCase('a', 'a'));
        (0, assert_1.default)(strings.equalsIgnoreCase('abc', 'Abc'));
        (0, assert_1.default)(strings.equalsIgnoreCase('abc', 'ABC'));
        (0, assert_1.default)(strings.equalsIgnoreCase('Höhenmeter', 'HÖhenmeter'));
        (0, assert_1.default)(strings.equalsIgnoreCase('ÖL', 'Öl'));
    });
    (0, mocha_1.test)('beginsWithIgnoreCase', () => {
        (0, assert_1.default)(strings.startsWithIgnoreCase('', ''));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('', '1'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('1', ''));
        (0, assert_1.default)(strings.startsWithIgnoreCase('a', 'a'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('abc', 'Abc'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('abc', 'ABC'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('Höhenmeter', 'HÖhenmeter'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('ÖL', 'Öl'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'a'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'A'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'alles k'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'alles K'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'ALLES K'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'alles klar'));
        (0, assert_1.default)(strings.startsWithIgnoreCase('alles klar', 'ALLES KLAR'));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('alles klar', ' ALLES K'));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('alles klar', 'ALLES K '));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('alles klar', 'öALLES K '));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('alles klar', ' '));
        (0, assert_1.default)(!strings.startsWithIgnoreCase('alles klar', 'ö'));
    });
    (0, mocha_1.test)('compareIgnoreCase', () => {
        function assertCompareIgnoreCase(a, b, recurse = true) {
            let actual = strings.compareIgnoreCase(a, b);
            actual = actual > 0 ? 1 : actual < 0 ? -1 : actual;
            let expected = strings.compare(a.toLowerCase(), b.toLowerCase());
            expected = expected > 0 ? 1 : expected < 0 ? -1 : expected;
            assert_1.default.strictEqual(actual, expected, `${a} <> ${b}`);
            if (recurse) {
                assertCompareIgnoreCase(b, a, false);
            }
        }
        assertCompareIgnoreCase('', '');
        assertCompareIgnoreCase('abc', 'ABC');
        assertCompareIgnoreCase('abc', 'ABc');
        assertCompareIgnoreCase('abc', 'ABcd');
        assertCompareIgnoreCase('abc', 'abcd');
        assertCompareIgnoreCase('foo', 'föo');
        assertCompareIgnoreCase('Code', 'code');
        assertCompareIgnoreCase('Code', 'cöde');
        assertCompareIgnoreCase('B', 'a');
        assertCompareIgnoreCase('a', 'B');
        assertCompareIgnoreCase('b', 'a');
        assertCompareIgnoreCase('a', 'b');
        assertCompareIgnoreCase('aa', 'ab');
        assertCompareIgnoreCase('aa', 'aB');
        assertCompareIgnoreCase('aa', 'aA');
        assertCompareIgnoreCase('a', 'aa');
        assertCompareIgnoreCase('ab', 'aA');
        assertCompareIgnoreCase('O', '/');
    });
    (0, mocha_1.test)('compareIgnoreCase (substring)', () => {
        function assertCompareIgnoreCase(a, b, aStart, aEnd, bStart, bEnd, recurse = true) {
            let actual = strings.compareSubstringIgnoreCase(a, b, aStart, aEnd, bStart, bEnd);
            actual = actual > 0 ? 1 : actual < 0 ? -1 : actual;
            let expected = strings.compare(a.toLowerCase().substring(aStart, aEnd), b.toLowerCase().substring(bStart, bEnd));
            expected = expected > 0 ? 1 : expected < 0 ? -1 : expected;
            assert_1.default.strictEqual(actual, expected, `${a} <> ${b}`);
            if (recurse) {
                assertCompareIgnoreCase(b, a, bStart, bEnd, aStart, aEnd, false);
            }
        }
        assertCompareIgnoreCase('', '', 0, 0, 0, 0);
        assertCompareIgnoreCase('abc', 'ABC', 0, 1, 0, 1);
        assertCompareIgnoreCase('abc', 'Aabc', 0, 3, 1, 4);
        assertCompareIgnoreCase('abcABc', 'ABcd', 3, 6, 0, 4);
    });
    (0, mocha_1.test)('format', () => {
        assert_1.default.strictEqual(strings.format('Foo Bar'), 'Foo Bar');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar'), 'Foo {0} Bar');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar', 'yes'), 'Foo yes Bar');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar {0}', 'yes'), 'Foo yes Bar yes');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes'), 'Foo yes Bar {1}{2}');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes', undefined), 'Foo yes Bar undefined{2}');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes', 5, false), 'Foo yes Bar 5false');
        assert_1.default.strictEqual(strings.format('Foo {0} Bar. {1}', '(foo)', '.test'), 'Foo (foo) Bar. .test');
    });
    (0, mocha_1.test)('format2', () => {
        assert_1.default.strictEqual(strings.format2('Foo Bar', {}), 'Foo Bar');
        assert_1.default.strictEqual(strings.format2('Foo {oops} Bar', {}), 'Foo {oops} Bar');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar', { foo: 'bar' }), 'Foo bar Bar');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar {foo}', { foo: 'bar' }), 'Foo bar Bar bar');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar' }), 'Foo bar Bar {bar}{boo}');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar', bar: 'undefined' }), 'Foo bar Bar undefined{boo}');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar', bar: '5', boo: false }), 'Foo bar Bar 5false');
        assert_1.default.strictEqual(strings.format2('Foo {foo} Bar. {bar}', { foo: '(foo)', bar: '.test' }), 'Foo (foo) Bar. .test');
    });
    (0, mocha_1.test)('lcut', () => {
        assert_1.default.strictEqual(strings.lcut('foo bar', 0), '');
        assert_1.default.strictEqual(strings.lcut('foo bar', 1), 'bar');
        assert_1.default.strictEqual(strings.lcut('foo bar', 3), 'bar');
        assert_1.default.strictEqual(strings.lcut('foo bar', 4), 'bar'); // Leading whitespace trimmed
        assert_1.default.strictEqual(strings.lcut('foo bar', 5), 'foo bar');
        assert_1.default.strictEqual(strings.lcut('test string 0.1.2.3', 3), '2.3');
        assert_1.default.strictEqual(strings.lcut('', 10), '');
        assert_1.default.strictEqual(strings.lcut('a', 10), 'a');
    });
    (0, mocha_1.test)('escape', () => {
        assert_1.default.strictEqual(strings.escape(''), '');
        assert_1.default.strictEqual(strings.escape('foo'), 'foo');
        assert_1.default.strictEqual(strings.escape('foo bar'), 'foo bar');
        assert_1.default.strictEqual(strings.escape('<foo bar>'), '&lt;foo bar&gt;');
        assert_1.default.strictEqual(strings.escape('<foo>Hello</foo>'), '&lt;foo&gt;Hello&lt;/foo&gt;');
    });
    (0, mocha_1.test)('ltrim', () => {
        assert_1.default.strictEqual(strings.ltrim('foo', 'f'), 'oo');
        assert_1.default.strictEqual(strings.ltrim('foo', 'o'), 'foo');
        assert_1.default.strictEqual(strings.ltrim('http://www.test.de', 'http://'), 'www.test.de');
        assert_1.default.strictEqual(strings.ltrim('/foo/', '/'), 'foo/');
        assert_1.default.strictEqual(strings.ltrim('//foo/', '/'), 'foo/');
        assert_1.default.strictEqual(strings.ltrim('/', ''), '/');
        assert_1.default.strictEqual(strings.ltrim('/', '/'), '');
        assert_1.default.strictEqual(strings.ltrim('///', '/'), '');
        assert_1.default.strictEqual(strings.ltrim('', ''), '');
        assert_1.default.strictEqual(strings.ltrim('', '/'), '');
    });
    (0, mocha_1.test)('rtrim', () => {
        assert_1.default.strictEqual(strings.rtrim('foo', 'o'), 'f');
        assert_1.default.strictEqual(strings.rtrim('foo', 'f'), 'foo');
        assert_1.default.strictEqual(strings.rtrim('http://www.test.de', '.de'), 'http://www.test');
        assert_1.default.strictEqual(strings.rtrim('/foo/', '/'), '/foo');
        assert_1.default.strictEqual(strings.rtrim('/foo//', '/'), '/foo');
        assert_1.default.strictEqual(strings.rtrim('/', ''), '/');
        assert_1.default.strictEqual(strings.rtrim('/', '/'), '');
        assert_1.default.strictEqual(strings.rtrim('///', '/'), '');
        assert_1.default.strictEqual(strings.rtrim('', ''), '');
        assert_1.default.strictEqual(strings.rtrim('', '/'), '');
    });
    (0, mocha_1.test)('trim', () => {
        assert_1.default.strictEqual(strings.trim(' foo '), 'foo');
        assert_1.default.strictEqual(strings.trim('  foo'), 'foo');
        assert_1.default.strictEqual(strings.trim('bar  '), 'bar');
        assert_1.default.strictEqual(strings.trim('   '), '');
        assert_1.default.strictEqual(strings.trim('foo bar', 'bar'), 'foo ');
    });
    (0, mocha_1.test)('trimWhitespace', () => {
        assert_1.default.strictEqual(' foo '.trim(), 'foo');
        assert_1.default.strictEqual('	 foo	'.trim(), 'foo');
        assert_1.default.strictEqual('  foo'.trim(), 'foo');
        assert_1.default.strictEqual('bar  '.trim(), 'bar');
        assert_1.default.strictEqual('   '.trim(), '');
        assert_1.default.strictEqual(' 	  '.trim(), '');
    });
    (0, mocha_1.test)('lastNonWhitespaceIndex', () => {
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t '), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc'), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc\t'), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc '), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t '), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t abc \t \t '), 11);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t abc \t \t ', 8), 2);
        assert_1.default.strictEqual(strings.lastNonWhitespaceIndex('  \t \t '), -1);
    });
    (0, mocha_1.test)('containsRTL', () => {
        assert_1.default.strictEqual(strings.containsRTL('a'), false);
        assert_1.default.strictEqual(strings.containsRTL(''), false);
        assert_1.default.strictEqual(strings.containsRTL(strings.UTF8_BOM_CHARACTER + 'a'), false);
        assert_1.default.strictEqual(strings.containsRTL('hello world!'), false);
        assert_1.default.strictEqual(strings.containsRTL('a📚📚b'), false);
        assert_1.default.strictEqual(strings.containsRTL('هناك حقيقة مثبتة منذ زمن طويل'), true);
        assert_1.default.strictEqual(strings.containsRTL('זוהי עובדה מבוססת שדעתו'), true);
    });
    (0, mocha_1.test)('containsEmoji', () => {
        assert_1.default.strictEqual(strings.containsEmoji('a'), false);
        assert_1.default.strictEqual(strings.containsEmoji(''), false);
        assert_1.default.strictEqual(strings.containsEmoji(strings.UTF8_BOM_CHARACTER + 'a'), false);
        assert_1.default.strictEqual(strings.containsEmoji('hello world!'), false);
        assert_1.default.strictEqual(strings.containsEmoji('هناك حقيقة مثبتة منذ زمن طويل'), false);
        assert_1.default.strictEqual(strings.containsEmoji('זוהי עובדה מבוססת שדעתו'), false);
        assert_1.default.strictEqual(strings.containsEmoji('a📚📚b'), true);
        assert_1.default.strictEqual(strings.containsEmoji('1F600 # 😀 grinning face'), true);
        assert_1.default.strictEqual(strings.containsEmoji('1F47E # 👾 alien monster'), true);
        assert_1.default.strictEqual(strings.containsEmoji('1F467 1F3FD # 👧🏽 girl: medium skin tone'), true);
        assert_1.default.strictEqual(strings.containsEmoji('26EA # ⛪ church'), true);
        assert_1.default.strictEqual(strings.containsEmoji('231B # ⌛ hourglass'), true);
        assert_1.default.strictEqual(strings.containsEmoji('2702 # ✂ scissors'), true);
        assert_1.default.strictEqual(strings.containsEmoji('1F1F7 1F1F4  # 🇷🇴 Romania'), true);
    });
    (0, mocha_1.test)('issue #115221: isEmojiImprecise misses ⭐', () => {
        const codePoint = strings.getNextCodePoint('⭐', '⭐'.length, 0);
        assert_1.default.strictEqual(strings.isEmojiImprecise(codePoint), true);
    });
    (0, mocha_1.test)('isBasicASCII', () => {
        function assertIsBasicASCII(str, expected) {
            assert_1.default.strictEqual(strings.isBasicASCII(str), expected, str + ` (${str.charCodeAt(0)})`);
        }
        assertIsBasicASCII('abcdefghijklmnopqrstuvwxyz', true);
        assertIsBasicASCII('ABCDEFGHIJKLMNOPQRSTUVWXYZ', true);
        assertIsBasicASCII('1234567890', true);
        assertIsBasicASCII('`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?', true);
        assertIsBasicASCII(' ', true);
        assertIsBasicASCII('\t', true);
        assertIsBasicASCII('\n', true);
        assertIsBasicASCII('\r', true);
        let ALL = '\r\t\n';
        for (let i = 32; i < 127; i++) {
            ALL += String.fromCharCode(i);
        }
        assertIsBasicASCII(ALL, true);
        assertIsBasicASCII(String.fromCharCode(31), false);
        assertIsBasicASCII(String.fromCharCode(127), false);
        assertIsBasicASCII('ü', false);
        assertIsBasicASCII('a📚📚b', false);
    });
    (0, mocha_1.test)('createRegExp', () => {
        // Empty
        assert_1.default.throws(() => strings.createRegExp('', false));
        // Escapes appropriately
        assert_1.default.strictEqual(strings.createRegExp('abc', false).source, 'abc');
        assert_1.default.strictEqual(strings.createRegExp('([^ ,.]*)', false).source, '\\(\\[\\^ ,\\.\\]\\*\\)');
        assert_1.default.strictEqual(strings.createRegExp('([^ ,.]*)', true).source, '([^ ,.]*)');
        // Whole word
        assert_1.default.strictEqual(strings.createRegExp('abc', false, { wholeWord: true }).source, '\\babc\\b');
        assert_1.default.strictEqual(strings.createRegExp('abc', true, { wholeWord: true }).source, '\\babc\\b');
        assert_1.default.strictEqual(strings.createRegExp(' abc', true, { wholeWord: true }).source, ' abc\\b');
        assert_1.default.strictEqual(strings.createRegExp('abc ', true, { wholeWord: true }).source, '\\babc ');
        assert_1.default.strictEqual(strings.createRegExp(' abc ', true, { wholeWord: true }).source, ' abc ');
        const regExpWithoutFlags = strings.createRegExp('abc', true);
        (0, assert_1.default)(!regExpWithoutFlags.global);
        (0, assert_1.default)(regExpWithoutFlags.ignoreCase);
        (0, assert_1.default)(!regExpWithoutFlags.multiline);
        const regExpWithFlags = strings.createRegExp('abc', true, { global: true, matchCase: true, multiline: true });
        (0, assert_1.default)(regExpWithFlags.global);
        (0, assert_1.default)(!regExpWithFlags.ignoreCase);
        (0, assert_1.default)(regExpWithFlags.multiline);
    });
    (0, mocha_1.test)('regExpContainsBackreference', () => {
        (0, assert_1.default)(strings.regExpContainsBackreference('foo \\5 bar'));
        (0, assert_1.default)(strings.regExpContainsBackreference('\\2'));
        (0, assert_1.default)(strings.regExpContainsBackreference('(\\d)(\\n)(\\1)'));
        (0, assert_1.default)(strings.regExpContainsBackreference('(A).*?\\1'));
        (0, assert_1.default)(strings.regExpContainsBackreference('\\\\\\1'));
        (0, assert_1.default)(strings.regExpContainsBackreference('foo \\\\\\1'));
        (0, assert_1.default)(!strings.regExpContainsBackreference(''));
        (0, assert_1.default)(!strings.regExpContainsBackreference('\\\\1'));
        (0, assert_1.default)(!strings.regExpContainsBackreference('foo \\\\1'));
        (0, assert_1.default)(!strings.regExpContainsBackreference('(A).*?\\\\1'));
        (0, assert_1.default)(!strings.regExpContainsBackreference('foo \\d1 bar'));
        (0, assert_1.default)(!strings.regExpContainsBackreference('123'));
    });
    (0, mocha_1.test)('getLeadingWhitespace', () => {
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  foo'), '  ');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  foo', 2), '');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  foo', 1, 1), '');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  foo', 0, 1), ' ');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  '), '  ');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  ', 1), ' ');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('  ', 0, 1), ' ');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('\t\tfunction foo(){', 0, 1), '\t');
        assert_1.default.strictEqual(strings.getLeadingWhitespace('\t\tfunction foo(){', 0, 2), '\t\t');
    });
    (0, mocha_1.test)('fuzzyContains', () => {
        assert_1.default.ok(!strings.fuzzyContains((undefined), null));
        assert_1.default.ok(strings.fuzzyContains('hello world', 'h'));
        assert_1.default.ok(!strings.fuzzyContains('hello world', 'q'));
        assert_1.default.ok(strings.fuzzyContains('hello world', 'hw'));
        assert_1.default.ok(strings.fuzzyContains('hello world', 'horl'));
        assert_1.default.ok(strings.fuzzyContains('hello world', 'd'));
        assert_1.default.ok(!strings.fuzzyContains('hello world', 'wh'));
        assert_1.default.ok(!strings.fuzzyContains('d', 'dd'));
    });
    (0, mocha_1.test)('startsWithUTF8BOM', () => {
        (0, assert_1.default)(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER));
        (0, assert_1.default)(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER + 'a'));
        (0, assert_1.default)(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER + 'aaaaaaaaaa'));
        (0, assert_1.default)(!strings.startsWithUTF8BOM(' ' + strings.UTF8_BOM_CHARACTER));
        (0, assert_1.default)(!strings.startsWithUTF8BOM('foo'));
        (0, assert_1.default)(!strings.startsWithUTF8BOM(''));
    });
    (0, mocha_1.test)('stripUTF8BOM', () => {
        assert_1.default.strictEqual(strings.stripUTF8BOM(strings.UTF8_BOM_CHARACTER), '');
        assert_1.default.strictEqual(strings.stripUTF8BOM(strings.UTF8_BOM_CHARACTER + 'foobar'), 'foobar');
        assert_1.default.strictEqual(strings.stripUTF8BOM('foobar' + strings.UTF8_BOM_CHARACTER), 'foobar' + strings.UTF8_BOM_CHARACTER);
        assert_1.default.strictEqual(strings.stripUTF8BOM('abc'), 'abc');
        assert_1.default.strictEqual(strings.stripUTF8BOM(''), '');
    });
    (0, mocha_1.test)('containsUppercaseCharacter', () => {
        [
            [null, false],
            ['', false],
            ['foo', false],
            ['föö', false],
            ['ناك', false],
            ['מבוססת', false],
            ['😀', false],
            ['(#@()*&%()@*#&09827340982374}{:">?></\'\\~`', false],
            ['Foo', true],
            ['FOO', true],
            ['FöÖ', true],
            ['FöÖ', true],
            ['\\Foo', true],
        ].forEach(([str, result]) => {
            assert_1.default.strictEqual(strings.containsUppercaseCharacter(str), result, `Wrong result for ${str}`);
        });
    });
    (0, mocha_1.test)('containsUppercaseCharacter (ignoreEscapedChars)', () => {
        [
            ['\\Woo', false],
            ['f\\S\\S', false],
            ['foo', false],
            ['Foo', true],
        ].forEach(([str, result]) => {
            assert_1.default.strictEqual(strings.containsUppercaseCharacter(str, true), result, `Wrong result for ${str}`);
        });
    });
    (0, mocha_1.test)('uppercaseFirstLetter', () => {
        [
            ['', ''],
            ['foo', 'Foo'],
            ['f', 'F'],
            ['123', '123'],
            ['.a', '.a'],
        ].forEach(([inStr, result]) => {
            assert_1.default.strictEqual(strings.uppercaseFirstLetter(inStr), result, `Wrong result for ${inStr}`);
        });
    });
    (0, mocha_1.test)('getNLines', () => {
        assert_1.default.strictEqual(strings.getNLines('', 5), '');
        assert_1.default.strictEqual(strings.getNLines('foo', 5), 'foo');
        assert_1.default.strictEqual(strings.getNLines('foo\nbar', 5), 'foo\nbar');
        assert_1.default.strictEqual(strings.getNLines('foo\nbar', 2), 'foo\nbar');
        assert_1.default.strictEqual(strings.getNLines('foo\nbar', 1), 'foo');
        assert_1.default.strictEqual(strings.getNLines('foo\nbar'), 'foo');
        assert_1.default.strictEqual(strings.getNLines('foo\nbar\nsomething', 2), 'foo\nbar');
        assert_1.default.strictEqual(strings.getNLines('foo', 0), '');
    });
    (0, mocha_1.test)('encodeUTF8', function () {
        function assertEncodeUTF8(str, expected) {
            const actual = strings.encodeUTF8(str);
            const actualArr = [];
            for (let offset = 0; offset < actual.byteLength; offset++) {
                actualArr[offset] = actual[offset];
            }
            assert_1.default.deepStrictEqual(actualArr, expected);
        }
        function assertDecodeUTF8(data, expected) {
            const actual = strings.decodeUTF8(new Uint8Array(data));
            assert_1.default.deepStrictEqual(actual, expected);
        }
        function assertEncodeDecodeUTF8(str, buff) {
            assertEncodeUTF8(str, buff);
            assertDecodeUTF8(buff, str);
        }
        assertEncodeDecodeUTF8('\u0000', [0]);
        assertEncodeDecodeUTF8('!', [33]);
        assertEncodeDecodeUTF8('\u007F', [127]);
        assertEncodeDecodeUTF8('\u0080', [194, 128]);
        assertEncodeDecodeUTF8('Ɲ', [198, 157]);
        assertEncodeDecodeUTF8('\u07FF', [223, 191]);
        assertEncodeDecodeUTF8('\u0800', [224, 160, 128]);
        assertEncodeDecodeUTF8('ஂ', [224, 174, 130]);
        assertEncodeDecodeUTF8('\uffff', [239, 191, 191]);
        assertEncodeDecodeUTF8('\u10000', [225, 128, 128, 48]);
        assertEncodeDecodeUTF8('🧝', [240, 159, 167, 157]);
    });
    (0, mocha_1.test)('getGraphemeBreakType', () => {
        assert_1.default.strictEqual(strings.getGraphemeBreakType(0xBC1), 7 /* SpacingMark */);
    });
    (0, mocha_1.test)('truncate', () => {
        assert_1.default.strictEqual('hello world', strings.truncate('hello world', 100));
        assert_1.default.strictEqual('hello…', strings.truncate('hello world', 5));
    });
});
