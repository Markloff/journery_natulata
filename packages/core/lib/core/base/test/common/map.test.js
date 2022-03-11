"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const arrays_1 = require("../../../../core/base/common/arrays");
const map_1 = require("../../../../core/base/common/map");
const resources_1 = require("../../../../core/base/common/resources");
const stopwatch_1 = require("../../../../core/base/common/stopwatch");
const uri_1 = require("../../../../core/base/common/uri");
const mocha_1 = require("mocha");
(0, mocha_1.suite)('Map', () => {
    (0, mocha_1.test)('LinkedMap - Simple', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        assert.deepStrictEqual([...map.keys()], ['ak', 'bk']);
        assert.deepStrictEqual([...map.values()], ['av', 'bv']);
        assert.strictEqual(map.first, 'av');
        assert.strictEqual(map.last, 'bv');
    });
    (0, mocha_1.test)('LinkedMap - Touch Old one', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('ak', 'av', 1 /* AsOld */);
        assert.deepStrictEqual([...map.keys()], ['ak']);
        assert.deepStrictEqual([...map.values()], ['av']);
    });
    (0, mocha_1.test)('LinkedMap - Touch New one', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('ak', 'av', 2 /* AsNew */);
        assert.deepStrictEqual([...map.keys()], ['ak']);
        assert.deepStrictEqual([...map.values()], ['av']);
    });
    (0, mocha_1.test)('LinkedMap - Touch Old two', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        map.set('bk', 'bv', 1 /* AsOld */);
        assert.deepStrictEqual([...map.keys()], ['bk', 'ak']);
        assert.deepStrictEqual([...map.values()], ['bv', 'av']);
    });
    (0, mocha_1.test)('LinkedMap - Touch New two', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        map.set('ak', 'av', 2 /* AsNew */);
        assert.deepStrictEqual([...map.keys()], ['bk', 'ak']);
        assert.deepStrictEqual([...map.values()], ['bv', 'av']);
    });
    (0, mocha_1.test)('LinkedMap - Touch Old from middle', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        map.set('ck', 'cv');
        map.set('bk', 'bv', 1 /* AsOld */);
        assert.deepStrictEqual([...map.keys()], ['bk', 'ak', 'ck']);
        assert.deepStrictEqual([...map.values()], ['bv', 'av', 'cv']);
    });
    (0, mocha_1.test)('LinkedMap - Touch New from middle', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        map.set('ck', 'cv');
        map.set('bk', 'bv', 2 /* AsNew */);
        assert.deepStrictEqual([...map.keys()], ['ak', 'ck', 'bk']);
        assert.deepStrictEqual([...map.values()], ['av', 'cv', 'bv']);
    });
    (0, mocha_1.test)('LinkedMap - basics', function () {
        const map = new map_1.LinkedMap();
        assert.strictEqual(map.size, 0);
        map.set('1', 1);
        map.set('2', '2');
        map.set('3', true);
        const obj = Object.create(null);
        map.set('4', obj);
        const date = Date.now();
        map.set('5', date);
        assert.strictEqual(map.size, 5);
        assert.strictEqual(map.get('1'), 1);
        assert.strictEqual(map.get('2'), '2');
        assert.strictEqual(map.get('3'), true);
        assert.strictEqual(map.get('4'), obj);
        assert.strictEqual(map.get('5'), date);
        assert.ok(!map.get('6'));
        map.delete('6');
        assert.strictEqual(map.size, 5);
        assert.strictEqual(map.delete('1'), true);
        assert.strictEqual(map.delete('2'), true);
        assert.strictEqual(map.delete('3'), true);
        assert.strictEqual(map.delete('4'), true);
        assert.strictEqual(map.delete('5'), true);
        assert.strictEqual(map.size, 0);
        assert.ok(!map.get('5'));
        assert.ok(!map.get('4'));
        assert.ok(!map.get('3'));
        assert.ok(!map.get('2'));
        assert.ok(!map.get('1'));
        map.set('1', 1);
        map.set('2', '2');
        map.set('3', true);
        assert.ok(map.has('1'));
        assert.strictEqual(map.get('1'), 1);
        assert.strictEqual(map.get('2'), '2');
        assert.strictEqual(map.get('3'), true);
        map.clear();
        assert.strictEqual(map.size, 0);
        assert.ok(!map.get('1'));
        assert.ok(!map.get('2'));
        assert.ok(!map.get('3'));
        assert.ok(!map.has('1'));
    });
    (0, mocha_1.test)('LinkedMap - Iterators', () => {
        const map = new map_1.LinkedMap();
        map.set(1, 1);
        map.set(2, 2);
        map.set(3, 3);
        for (const elem of map.keys()) {
            assert.ok(elem);
        }
        for (const elem of map.values()) {
            assert.ok(elem);
        }
        for (const elem of map.entries()) {
            assert.ok(elem);
        }
        {
            const keys = map.keys();
            const values = map.values();
            const entries = map.entries();
            map.get(1);
            keys.next();
            values.next();
            entries.next();
        }
        {
            const keys = map.keys();
            const values = map.values();
            const entries = map.entries();
            map.get(1, 2 /* AsNew */);
            let exceptions = 0;
            try {
                keys.next();
            }
            catch (err) {
                exceptions++;
            }
            try {
                values.next();
            }
            catch (err) {
                exceptions++;
            }
            try {
                entries.next();
            }
            catch (err) {
                exceptions++;
            }
            assert.strictEqual(exceptions, 3);
        }
    });
    (0, mocha_1.test)('LinkedMap - LRU Cache simple', () => {
        const cache = new map_1.LRUCache(5);
        [1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
        assert.strictEqual(cache.size, 5);
        cache.set(6, 6);
        assert.strictEqual(cache.size, 5);
        assert.deepStrictEqual([...cache.keys()], [2, 3, 4, 5, 6]);
        cache.set(7, 7);
        assert.strictEqual(cache.size, 5);
        assert.deepStrictEqual([...cache.keys()], [3, 4, 5, 6, 7]);
        let values = [];
        [3, 4, 5, 6, 7].forEach(key => values.push(cache.get(key)));
        assert.deepStrictEqual(values, [3, 4, 5, 6, 7]);
    });
    (0, mocha_1.test)('LinkedMap - LRU Cache get', () => {
        const cache = new map_1.LRUCache(5);
        [1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
        assert.strictEqual(cache.size, 5);
        assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 5]);
        cache.get(3);
        assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
        cache.peek(4);
        assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
        let values = [];
        [1, 2, 3, 4, 5].forEach(key => values.push(cache.get(key)));
        assert.deepStrictEqual(values, [1, 2, 3, 4, 5]);
    });
    (0, mocha_1.test)('LinkedMap - LRU Cache limit', () => {
        const cache = new map_1.LRUCache(10);
        for (let i = 1; i <= 10; i++) {
            cache.set(i, i);
        }
        assert.strictEqual(cache.size, 10);
        cache.limit = 5;
        assert.strictEqual(cache.size, 5);
        assert.deepStrictEqual([...cache.keys()], [6, 7, 8, 9, 10]);
        cache.limit = 20;
        assert.strictEqual(cache.size, 5);
        for (let i = 11; i <= 20; i++) {
            cache.set(i, i);
        }
        assert.deepStrictEqual(cache.size, 15);
        let values = [];
        for (let i = 6; i <= 20; i++) {
            values.push(cache.get(i));
            assert.strictEqual(cache.get(i), i);
        }
        assert.deepStrictEqual([...cache.values()], values);
    });
    (0, mocha_1.test)('LinkedMap - LRU Cache limit with ratio', () => {
        const cache = new map_1.LRUCache(10, 0.5);
        for (let i = 1; i <= 10; i++) {
            cache.set(i, i);
        }
        assert.strictEqual(cache.size, 10);
        cache.set(11, 11);
        assert.strictEqual(cache.size, 5);
        assert.deepStrictEqual([...cache.keys()], [7, 8, 9, 10, 11]);
        let values = [];
        [...cache.keys()].forEach(key => values.push(cache.get(key)));
        assert.deepStrictEqual(values, [7, 8, 9, 10, 11]);
        assert.deepStrictEqual([...cache.values()], values);
    });
    (0, mocha_1.test)('LinkedMap - toJSON / fromJSON', () => {
        let map = new map_1.LinkedMap();
        map.set('ak', 'av');
        map.set('bk', 'bv');
        map.set('ck', 'cv');
        const json = map.toJSON();
        map = new map_1.LinkedMap();
        map.fromJSON(json);
        let i = 0;
        map.forEach((value, key) => {
            if (i === 0) {
                assert.strictEqual(key, 'ak');
                assert.strictEqual(value, 'av');
            }
            else if (i === 1) {
                assert.strictEqual(key, 'bk');
                assert.strictEqual(value, 'bv');
            }
            else if (i === 2) {
                assert.strictEqual(key, 'ck');
                assert.strictEqual(value, 'cv');
            }
            i++;
        });
    });
    (0, mocha_1.test)('LinkedMap - delete Head and Tail', function () {
        const map = new map_1.LinkedMap();
        assert.strictEqual(map.size, 0);
        map.set('1', 1);
        assert.strictEqual(map.size, 1);
        map.delete('1');
        assert.strictEqual(map.get('1'), undefined);
        assert.strictEqual(map.size, 0);
        assert.strictEqual([...map.keys()].length, 0);
    });
    (0, mocha_1.test)('LinkedMap - delete Head', function () {
        const map = new map_1.LinkedMap();
        assert.strictEqual(map.size, 0);
        map.set('1', 1);
        map.set('2', 2);
        assert.strictEqual(map.size, 2);
        map.delete('1');
        assert.strictEqual(map.get('2'), 2);
        assert.strictEqual(map.size, 1);
        assert.strictEqual([...map.keys()].length, 1);
        assert.strictEqual([...map.keys()][0], '2');
    });
    (0, mocha_1.test)('LinkedMap - delete Tail', function () {
        const map = new map_1.LinkedMap();
        assert.strictEqual(map.size, 0);
        map.set('1', 1);
        map.set('2', 2);
        assert.strictEqual(map.size, 2);
        map.delete('2');
        assert.strictEqual(map.get('1'), 1);
        assert.strictEqual(map.size, 1);
        assert.strictEqual([...map.keys()].length, 1);
        assert.strictEqual([...map.keys()][0], '1');
    });
    (0, mocha_1.test)('PathIterator', () => {
        const iter = new map_1.PathIterator();
        iter.reset('file:///usr/bin/file.txt');
        assert.strictEqual(iter.value(), 'file:');
        assert.strictEqual(iter.hasNext(), true);
        assert.strictEqual(iter.cmp('file:'), 0);
        assert.ok(iter.cmp('a') < 0);
        assert.ok(iter.cmp('aile:') < 0);
        assert.ok(iter.cmp('z') > 0);
        assert.ok(iter.cmp('zile:') > 0);
        iter.next();
        assert.strictEqual(iter.value(), 'usr');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'bin');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'file.txt');
        assert.strictEqual(iter.hasNext(), false);
        iter.next();
        assert.strictEqual(iter.value(), '');
        assert.strictEqual(iter.hasNext(), false);
        iter.next();
        assert.strictEqual(iter.value(), '');
        assert.strictEqual(iter.hasNext(), false);
        //
        iter.reset('/foo/bar/');
        assert.strictEqual(iter.value(), 'foo');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'bar');
        assert.strictEqual(iter.hasNext(), false);
    });
    (0, mocha_1.test)('URIIterator', function () {
        const iter = new map_1.UriIterator(() => false);
        iter.reset(uri_1.URI.parse('file:///usr/bin/file.txt'));
        assert.strictEqual(iter.value(), 'file');
        // assert.strictEqual(iter.cmp('FILE'), 0);
        assert.strictEqual(iter.cmp('file'), 0);
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'usr');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'bin');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        assert.strictEqual(iter.value(), 'file.txt');
        assert.strictEqual(iter.hasNext(), false);
        iter.reset(uri_1.URI.parse('file://share/usr/bin/file.txt?foo'));
        // scheme
        assert.strictEqual(iter.value(), 'file');
        // assert.strictEqual(iter.cmp('FILE'), 0);
        assert.strictEqual(iter.cmp('file'), 0);
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        // authority
        assert.strictEqual(iter.value(), 'share');
        assert.strictEqual(iter.cmp('SHARe'), 0);
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        // path
        assert.strictEqual(iter.value(), 'usr');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        // path
        assert.strictEqual(iter.value(), 'bin');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        // path
        assert.strictEqual(iter.value(), 'file.txt');
        assert.strictEqual(iter.hasNext(), true);
        iter.next();
        // query
        assert.strictEqual(iter.value(), 'foo');
        assert.strictEqual(iter.cmp('z') > 0, true);
        assert.strictEqual(iter.cmp('a') < 0, true);
        assert.strictEqual(iter.hasNext(), false);
    });
    function assertTernarySearchTree(trie, ...elements) {
        const map = new Map();
        for (const [key, value] of elements) {
            map.set(key, value);
        }
        map.forEach((value, key) => {
            assert.strictEqual(trie.get(key), value);
        });
        // forEach
        let forEachCount = 0;
        trie.forEach((element, key) => {
            assert.strictEqual(element, map.get(key));
            forEachCount++;
        });
        assert.strictEqual(map.size, forEachCount);
        // iterator
        let iterCount = 0;
        for (let [key, value] of trie) {
            assert.strictEqual(value, map.get(key));
            iterCount++;
        }
        assert.strictEqual(map.size, iterCount);
    }
    (0, mocha_1.test)('TernarySearchTree - set', function () {
        let trie = map_1.TernarySearchTree.forStrings();
        trie.set('foobar', 1);
        trie.set('foobaz', 2);
        assertTernarySearchTree(trie, ['foobar', 1], ['foobaz', 2]); // longer
        trie = map_1.TernarySearchTree.forStrings();
        trie.set('foobar', 1);
        trie.set('fooba', 2);
        assertTernarySearchTree(trie, ['foobar', 1], ['fooba', 2]); // shorter
        trie = map_1.TernarySearchTree.forStrings();
        trie.set('foo', 1);
        trie.set('foo', 2);
        assertTernarySearchTree(trie, ['foo', 2]);
        trie = map_1.TernarySearchTree.forStrings();
        trie.set('foo', 1);
        trie.set('foobar', 2);
        trie.set('bar', 3);
        trie.set('foob', 4);
        trie.set('bazz', 5);
        assertTernarySearchTree(trie, ['foo', 1], ['foobar', 2], ['bar', 3], ['foob', 4], ['bazz', 5]);
    });
    (0, mocha_1.test)('TernarySearchTree - findLongestMatch', function () {
        let trie = map_1.TernarySearchTree.forStrings();
        trie.set('foo', 1);
        trie.set('foobar', 2);
        trie.set('foobaz', 3);
        assert.strictEqual(trie.findSubstr('f'), undefined);
        assert.strictEqual(trie.findSubstr('z'), undefined);
        assert.strictEqual(trie.findSubstr('foo'), 1);
        assert.strictEqual(trie.findSubstr('fooö'), 1);
        assert.strictEqual(trie.findSubstr('fooba'), 1);
        assert.strictEqual(trie.findSubstr('foobarr'), 2);
        assert.strictEqual(trie.findSubstr('foobazrr'), 3);
    });
    (0, mocha_1.test)('TernarySearchTree - basics', function () {
        let trie = new map_1.TernarySearchTree(new map_1.StringIterator());
        trie.set('foo', 1);
        trie.set('bar', 2);
        trie.set('foobar', 3);
        assert.strictEqual(trie.get('foo'), 1);
        assert.strictEqual(trie.get('bar'), 2);
        assert.strictEqual(trie.get('foobar'), 3);
        assert.strictEqual(trie.get('foobaz'), undefined);
        assert.strictEqual(trie.get('foobarr'), undefined);
        assert.strictEqual(trie.findSubstr('fo'), undefined);
        assert.strictEqual(trie.findSubstr('foo'), 1);
        assert.strictEqual(trie.findSubstr('foooo'), 1);
        trie.delete('foobar');
        trie.delete('bar');
        assert.strictEqual(trie.get('foobar'), undefined);
        assert.strictEqual(trie.get('bar'), undefined);
        trie.set('foobar', 17);
        trie.set('barr', 18);
        assert.strictEqual(trie.get('foobar'), 17);
        assert.strictEqual(trie.get('barr'), 18);
        assert.strictEqual(trie.get('bar'), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree - delete & cleanup', function () {
        // normal delete
        let trie = new map_1.TernarySearchTree(new map_1.StringIterator());
        trie.set('foo', 1);
        trie.set('foobar', 2);
        trie.set('bar', 3);
        assertTernarySearchTree(trie, ['foo', 1], ['foobar', 2], ['bar', 3]);
        trie.delete('foo');
        assertTernarySearchTree(trie, ['foobar', 2], ['bar', 3]);
        trie.delete('foobar');
        assertTernarySearchTree(trie, ['bar', 3]);
        // superstr-delete
        trie = new map_1.TernarySearchTree(new map_1.StringIterator());
        trie.set('foo', 1);
        trie.set('foobar', 2);
        trie.set('bar', 3);
        trie.set('foobarbaz', 4);
        trie.deleteSuperstr('foo');
        assertTernarySearchTree(trie, ['foo', 1], ['bar', 3]);
        trie = new map_1.TernarySearchTree(new map_1.StringIterator());
        trie.set('foo', 1);
        trie.set('foobar', 2);
        trie.set('bar', 3);
        trie.set('foobarbaz', 4);
        trie.deleteSuperstr('fo');
        assertTernarySearchTree(trie, ['bar', 3]);
        // trie = new TernarySearchTree<string, number>(new StringIterator());
        // trie.set('foo', 1);
        // trie.set('foobar', 2);
        // trie.set('bar', 3);
        // trie.deleteSuperStr('f');
        // assertTernarySearchTree(trie, ['bar', 3]);
    });
    (0, mocha_1.test)('TernarySearchTree (PathSegments) - basics', function () {
        let trie = new map_1.TernarySearchTree(new map_1.PathIterator());
        trie.set('/user/foo/bar', 1);
        trie.set('/user/foo', 2);
        trie.set('/user/foo/flip/flop', 3);
        assert.strictEqual(trie.get('/user/foo/bar'), 1);
        assert.strictEqual(trie.get('/user/foo'), 2);
        assert.strictEqual(trie.get('/user//foo'), 2);
        assert.strictEqual(trie.get('/user\\foo'), 2);
        assert.strictEqual(trie.get('/user/foo/flip/flop'), 3);
        assert.strictEqual(trie.findSubstr('/user/bar'), undefined);
        assert.strictEqual(trie.findSubstr('/user/foo'), 2);
        assert.strictEqual(trie.findSubstr('\\user\\foo'), 2);
        assert.strictEqual(trie.findSubstr('/user//foo'), 2);
        assert.strictEqual(trie.findSubstr('/user/foo/ba'), 2);
        assert.strictEqual(trie.findSubstr('/user/foo/far/boo'), 2);
        assert.strictEqual(trie.findSubstr('/user/foo/bar'), 1);
        assert.strictEqual(trie.findSubstr('/user/foo/bar/far/boo'), 1);
    });
    (0, mocha_1.test)('TernarySearchTree (PathSegments) - lookup', function () {
        const map = new map_1.TernarySearchTree(new map_1.PathIterator());
        map.set('/user/foo/bar', 1);
        map.set('/user/foo', 2);
        map.set('/user/foo/flip/flop', 3);
        assert.strictEqual(map.get('/foo'), undefined);
        assert.strictEqual(map.get('/user'), undefined);
        assert.strictEqual(map.get('/user/foo'), 2);
        assert.strictEqual(map.get('/user/foo/bar'), 1);
        assert.strictEqual(map.get('/user/foo/bar/boo'), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (PathSegments) - superstr', function () {
        const map = new map_1.TernarySearchTree(new map_1.PathIterator());
        map.set('/user/foo/bar', 1);
        map.set('/user/foo', 2);
        map.set('/user/foo/flip/flop', 3);
        map.set('/usr/foo', 4);
        let item;
        let iter = map.findSuperstr('/user');
        item = iter.next();
        assert.strictEqual(item.value[1], 2);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 1);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 3);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        iter = map.findSuperstr('/usr');
        item = iter.next();
        assert.strictEqual(item.value[1], 4);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        assert.strictEqual(map.findSuperstr('/not'), undefined);
        assert.strictEqual(map.findSuperstr('/us'), undefined);
        assert.strictEqual(map.findSuperstr('/usrr'), undefined);
        assert.strictEqual(map.findSuperstr('/userr'), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (PathSegments) - delete_superstr', function () {
        const map = new map_1.TernarySearchTree(new map_1.PathIterator());
        map.set('/user/foo/bar', 1);
        map.set('/user/foo', 2);
        map.set('/user/foo/flip/flop', 3);
        map.set('/usr/foo', 4);
        assertTernarySearchTree(map, ['/user/foo/bar', 1], ['/user/foo', 2], ['/user/foo/flip/flop', 3], ['/usr/foo', 4]);
        // not a segment
        map.deleteSuperstr('/user/fo');
        assertTernarySearchTree(map, ['/user/foo/bar', 1], ['/user/foo', 2], ['/user/foo/flip/flop', 3], ['/usr/foo', 4]);
        // delete a segment
        map.set('/user/foo/bar', 1);
        map.set('/user/foo', 2);
        map.set('/user/foo/flip/flop', 3);
        map.set('/usr/foo', 4);
        map.deleteSuperstr('/user/foo');
        assertTernarySearchTree(map, ['/user/foo', 2], ['/usr/foo', 4]);
    });
    (0, mocha_1.test)('TernarySearchTree (URI) - basics', function () {
        let trie = new map_1.TernarySearchTree(new map_1.UriIterator(() => false));
        trie.set(uri_1.URI.file('/user/foo/bar'), 1);
        trie.set(uri_1.URI.file('/user/foo'), 2);
        trie.set(uri_1.URI.file('/user/foo/flip/flop'), 3);
        assert.strictEqual(trie.get(uri_1.URI.file('/user/foo/bar')), 1);
        assert.strictEqual(trie.get(uri_1.URI.file('/user/foo')), 2);
        assert.strictEqual(trie.get(uri_1.URI.file('/user/foo/flip/flop')), 3);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/bar')), undefined);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/foo')), 2);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/foo/ba')), 2);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/foo/far/boo')), 2);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/foo/bar')), 1);
        assert.strictEqual(trie.findSubstr(uri_1.URI.file('/user/foo/bar/far/boo')), 1);
    });
    (0, mocha_1.test)('TernarySearchTree (URI) - lookup', function () {
        const map = new map_1.TernarySearchTree(new map_1.UriIterator(() => false));
        map.set(uri_1.URI.parse('http://foo.bar/user/foo/bar'), 1);
        map.set(uri_1.URI.parse('http://foo.bar/user/foo?query'), 2);
        map.set(uri_1.URI.parse('http://foo.bar/user/foo?QUERY'), 3);
        map.set(uri_1.URI.parse('http://foo.bar/user/foo/flip/flop'), 3);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/foo')), undefined);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user')), undefined);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user/foo/bar')), 1);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user/foo?query')), 2);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user/foo?Query')), undefined);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user/foo?QUERY')), 3);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/user/foo/bar/boo')), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (URI) - lookup, casing', function () {
        const map = new map_1.TernarySearchTree(new map_1.UriIterator(uri => /^https?$/.test(uri.scheme)));
        map.set(uri_1.URI.parse('http://foo.bar/user/foo/bar'), 1);
        assert.strictEqual(map.get(uri_1.URI.parse('http://foo.bar/USER/foo/bar')), 1);
        map.set(uri_1.URI.parse('foo://foo.bar/user/foo/bar'), 1);
        assert.strictEqual(map.get(uri_1.URI.parse('foo://foo.bar/USER/foo/bar')), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (URI) - superstr', function () {
        const map = new map_1.TernarySearchTree(new map_1.UriIterator(() => false));
        map.set(uri_1.URI.file('/user/foo/bar'), 1);
        map.set(uri_1.URI.file('/user/foo'), 2);
        map.set(uri_1.URI.file('/user/foo/flip/flop'), 3);
        map.set(uri_1.URI.file('/usr/foo'), 4);
        let item;
        let iter = map.findSuperstr(uri_1.URI.file('/user'));
        item = iter.next();
        assert.strictEqual(item.value[1], 2);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 1);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 3);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        iter = map.findSuperstr(uri_1.URI.file('/usr'));
        item = iter.next();
        assert.strictEqual(item.value[1], 4);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        iter = map.findSuperstr(uri_1.URI.file('/'));
        item = iter.next();
        assert.strictEqual(item.value[1], 4);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 2);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 1);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 3);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        assert.strictEqual(map.findSuperstr(uri_1.URI.file('/not')), undefined);
        assert.strictEqual(map.findSuperstr(uri_1.URI.file('/us')), undefined);
        assert.strictEqual(map.findSuperstr(uri_1.URI.file('/usrr')), undefined);
        assert.strictEqual(map.findSuperstr(uri_1.URI.file('/userr')), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (ConfigKeySegments) - basics', function () {
        let trie = new map_1.TernarySearchTree(new map_1.ConfigKeysIterator());
        trie.set('config.foo.bar', 1);
        trie.set('config.foo', 2);
        trie.set('config.foo.flip.flop', 3);
        assert.strictEqual(trie.get('config.foo.bar'), 1);
        assert.strictEqual(trie.get('config.foo'), 2);
        assert.strictEqual(trie.get('config.foo.flip.flop'), 3);
        assert.strictEqual(trie.findSubstr('config.bar'), undefined);
        assert.strictEqual(trie.findSubstr('config.foo'), 2);
        assert.strictEqual(trie.findSubstr('config.foo.ba'), 2);
        assert.strictEqual(trie.findSubstr('config.foo.far.boo'), 2);
        assert.strictEqual(trie.findSubstr('config.foo.bar'), 1);
        assert.strictEqual(trie.findSubstr('config.foo.bar.far.boo'), 1);
    });
    (0, mocha_1.test)('TernarySearchTree (ConfigKeySegments) - lookup', function () {
        const map = new map_1.TernarySearchTree(new map_1.ConfigKeysIterator());
        map.set('config.foo.bar', 1);
        map.set('config.foo', 2);
        map.set('config.foo.flip.flop', 3);
        assert.strictEqual(map.get('foo'), undefined);
        assert.strictEqual(map.get('config'), undefined);
        assert.strictEqual(map.get('config.foo'), 2);
        assert.strictEqual(map.get('config.foo.bar'), 1);
        assert.strictEqual(map.get('config.foo.bar.boo'), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (ConfigKeySegments) - superstr', function () {
        const map = new map_1.TernarySearchTree(new map_1.ConfigKeysIterator());
        map.set('config.foo.bar', 1);
        map.set('config.foo', 2);
        map.set('config.foo.flip.flop', 3);
        map.set('boo', 4);
        let item;
        let iter = map.findSuperstr('config');
        item = iter.next();
        assert.strictEqual(item.value[1], 2);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 1);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value[1], 3);
        assert.strictEqual(item.done, false);
        item = iter.next();
        assert.strictEqual(item.value, undefined);
        assert.strictEqual(item.done, true);
        assert.strictEqual(map.findSuperstr('foo'), undefined);
        assert.strictEqual(map.findSuperstr('config.foo.no'), undefined);
        assert.strictEqual(map.findSuperstr('config.foop'), undefined);
    });
    (0, mocha_1.test)('TernarySearchTree (ConfigKeySegments) - delete_superstr', function () {
        const map = new map_1.TernarySearchTree(new map_1.ConfigKeysIterator());
        map.set('config.foo.bar', 1);
        map.set('config.foo', 2);
        map.set('config.foo.flip.flop', 3);
        map.set('boo', 4);
        assertTernarySearchTree(map, ['config.foo.bar', 1], ['config.foo', 2], ['config.foo.flip.flop', 3], ['boo', 4]);
        // not a segment
        map.deleteSuperstr('config.fo');
        assertTernarySearchTree(map, ['config.foo.bar', 1], ['config.foo', 2], ['config.foo.flip.flop', 3], ['boo', 4]);
        // delete a segment
        map.set('config.foo.bar', 1);
        map.set('config.foo', 2);
        map.set('config.foo.flip.flop', 3);
        map.set('config.boo', 4);
        map.deleteSuperstr('config.foo');
        assertTernarySearchTree(map, ['config.foo', 2], ['boo', 4]);
    });
    (0, mocha_1.test)('ResourceMap - basics', function () {
        const map = new map_1.ResourceMap();
        const resource1 = uri_1.URI.parse('some://1');
        const resource2 = uri_1.URI.parse('some://2');
        const resource3 = uri_1.URI.parse('some://3');
        const resource4 = uri_1.URI.parse('some://4');
        const resource5 = uri_1.URI.parse('some://5');
        const resource6 = uri_1.URI.parse('some://6');
        assert.strictEqual(map.size, 0);
        let res = map.set(resource1, 1);
        assert.ok(res === map);
        map.set(resource2, '2');
        map.set(resource3, true);
        const values = [...map.values()];
        assert.strictEqual(values[0], 1);
        assert.strictEqual(values[1], '2');
        assert.strictEqual(values[2], true);
        let counter = 0;
        map.forEach((value, key, mapObj) => {
            assert.strictEqual(value, values[counter++]);
            assert.ok(uri_1.URI.isUri(key));
            assert.ok(map === mapObj);
        });
        const obj = Object.create(null);
        map.set(resource4, obj);
        const date = Date.now();
        map.set(resource5, date);
        assert.strictEqual(map.size, 5);
        assert.strictEqual(map.get(resource1), 1);
        assert.strictEqual(map.get(resource2), '2');
        assert.strictEqual(map.get(resource3), true);
        assert.strictEqual(map.get(resource4), obj);
        assert.strictEqual(map.get(resource5), date);
        assert.ok(!map.get(resource6));
        map.delete(resource6);
        assert.strictEqual(map.size, 5);
        assert.ok(map.delete(resource1));
        assert.ok(map.delete(resource2));
        assert.ok(map.delete(resource3));
        assert.ok(map.delete(resource4));
        assert.ok(map.delete(resource5));
        assert.strictEqual(map.size, 0);
        assert.ok(!map.get(resource5));
        assert.ok(!map.get(resource4));
        assert.ok(!map.get(resource3));
        assert.ok(!map.get(resource2));
        assert.ok(!map.get(resource1));
        map.set(resource1, 1);
        map.set(resource2, '2');
        map.set(resource3, true);
        assert.ok(map.has(resource1));
        assert.strictEqual(map.get(resource1), 1);
        assert.strictEqual(map.get(resource2), '2');
        assert.strictEqual(map.get(resource3), true);
        map.clear();
        assert.strictEqual(map.size, 0);
        assert.ok(!map.get(resource1));
        assert.ok(!map.get(resource2));
        assert.ok(!map.get(resource3));
        assert.ok(!map.has(resource1));
        map.set(resource1, false);
        map.set(resource2, 0);
        assert.ok(map.has(resource1));
        assert.ok(map.has(resource2));
    });
    (0, mocha_1.test)('ResourceMap - files (do NOT ignorecase)', function () {
        const map = new map_1.ResourceMap();
        const fileA = uri_1.URI.parse('file://some/filea');
        const fileB = uri_1.URI.parse('some://some/other/fileb');
        const fileAUpper = uri_1.URI.parse('file://SOME/FILEA');
        map.set(fileA, 'true');
        assert.strictEqual(map.get(fileA), 'true');
        assert.ok(!map.get(fileAUpper));
        assert.ok(!map.get(fileB));
        map.set(fileAUpper, 'false');
        assert.strictEqual(map.get(fileAUpper), 'false');
        assert.strictEqual(map.get(fileA), 'true');
        const windowsFile = uri_1.URI.file('c:\\test with %25\\c#code');
        const uncFile = uri_1.URI.file('\\\\shäres\\path\\c#\\plugin.json');
        map.set(windowsFile, 'true');
        map.set(uncFile, 'true');
        assert.strictEqual(map.get(windowsFile), 'true');
        assert.strictEqual(map.get(uncFile), 'true');
    });
    (0, mocha_1.test)('ResourceMap - files (ignorecase)', function () {
        const map = new map_1.ResourceMap(uri => resources_1.extUriIgnorePathCase.getComparisonKey(uri));
        const fileA = uri_1.URI.parse('file://some/filea');
        const fileB = uri_1.URI.parse('some://some/other/fileb');
        const fileAUpper = uri_1.URI.parse('file://SOME/FILEA');
        map.set(fileA, 'true');
        assert.strictEqual(map.get(fileA), 'true');
        assert.strictEqual(map.get(fileAUpper), 'true');
        assert.ok(!map.get(fileB));
        map.set(fileAUpper, 'false');
        assert.strictEqual(map.get(fileAUpper), 'false');
        assert.strictEqual(map.get(fileA), 'false');
        const windowsFile = uri_1.URI.file('c:\\test with %25\\c#code');
        const uncFile = uri_1.URI.file('\\\\shäres\\path\\c#\\plugin.json');
        map.set(windowsFile, 'true');
        map.set(uncFile, 'true');
        assert.strictEqual(map.get(windowsFile), 'true');
        assert.strictEqual(map.get(uncFile), 'true');
    });
});
mocha_1.suite.skip('TST, perf', function () {
    function createRandomUris(n) {
        const uris = [];
        function randomWord() {
            let result = '';
            let length = 4 + Math.floor(Math.random() * 4);
            for (let i = 0; i < length; i++) {
                result += (Math.random() * 26 + 65).toString(36);
            }
            return result;
        }
        // generate 10000 random words
        const words = [];
        for (let i = 0; i < 10000; i++) {
            words.push(randomWord());
        }
        for (let i = 0; i < n; i++) {
            let len = 4 + Math.floor(Math.random() * 4);
            let segments = [];
            for (; len >= 0; len--) {
                segments.push(words[Math.floor(Math.random() * words.length)]);
            }
            uris.push(uri_1.URI.from({ scheme: 'file', path: segments.join('/') }));
        }
        return uris;
    }
    let tree;
    let sampleUris = [];
    let candidates = [];
    (0, mocha_1.suiteSetup)(() => {
        const len = 50000;
        sampleUris = createRandomUris(len);
        candidates = [...sampleUris.slice(0, len / 2), ...createRandomUris(len / 2)];
        (0, arrays_1.shuffle)(candidates);
    });
    (0, mocha_1.setup)(() => {
        tree = map_1.TernarySearchTree.forUris();
        for (let uri of sampleUris) {
            tree.set(uri, true);
        }
    });
    const _profile = false;
    function perfTest(name, callback) {
        (0, mocha_1.test)(name, function () {
            if (_profile) {
                console.profile(name);
            }
            const sw = new stopwatch_1.StopWatch(true);
            callback();
            console.log(name, sw.elapsed());
            if (_profile) {
                console.profileEnd();
            }
        });
    }
    perfTest('TST, clear', function () {
        tree.clear();
    });
    perfTest('TST, insert', function () {
        let insertTree = map_1.TernarySearchTree.forUris();
        for (let uri of sampleUris) {
            insertTree.set(uri, true);
        }
    });
    perfTest('TST, lookup', function () {
        let match = 0;
        for (let candidate of candidates) {
            if (tree.has(candidate)) {
                match += 1;
            }
        }
        assert.strictEqual(match, sampleUris.length / 2);
    });
    perfTest('TST, substr', function () {
        let match = 0;
        for (let candidate of candidates) {
            if (tree.findSubstr(candidate)) {
                match += 1;
            }
        }
        assert.strictEqual(match, sampleUris.length / 2);
    });
    perfTest('TST, superstr', function () {
        for (let candidate of candidates) {
            tree.findSuperstr(candidate);
        }
    });
});
