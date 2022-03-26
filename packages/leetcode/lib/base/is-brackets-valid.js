"use strict";
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
//
// 有效字符串需满足：
//
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
//  
//
// 示例 1：
//
// 输入：s = "()"
// 输出：true
// 示例 2：
//
// 输入：s = "()[]{}"
// 输出：true
// 示例 3：
//
// 输入：s = "(]"
// 输出：false
// 示例 4：
//
// 输入：s = "([)]"
// 输出：false
// 示例 5：
//
// 输入：s = "{[]}"
// 输出：true
//
// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/valid-parentheses
function isValid(s) {
    let stack = [];
    for (let i = 0; i < s.length; i++) {
        let bracket = s[i];
        if (bracket in BracketPair) {
            stack.push(bracket);
        }
        else {
            if (BracketPair[stack.pop()] !== bracket) {
                return false;
            }
        }
    }
    return stack.length === 0;
}
const BracketPair = {
    '(': ')',
    '[': ']',
    '{': '}',
};
[
    '()',
    '()[]{}',
    "(]",
    "([)]",
    "{[]}"
].forEach(item => {
    console.log(isValid(item));
});
