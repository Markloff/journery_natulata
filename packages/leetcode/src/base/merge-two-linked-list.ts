// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
//
//
// 示例 1：
//
//
// 输入：list1 = [1,2,4], list2 = [1,3,4]
// 输出：[1,1,2,3,4,4]
// 示例 2：
//
// 输入：list1 = [], list2 = []
// 输出：[]
// 示例 3：
//
// 输入：list1 = [], list2 = [0]
// 输出：[0]
//
//
// 提示：
//
// 两个链表的节点数目范围是 [0, 50]
// -100 <= Node.val <= 100
// list1 和 list2 均按 非递减顺序 排列
//
// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/merge-two-sorted-lists
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
class ListNode {
	val: number
	next: ListNode | null
	constructor(val?: number, next?: ListNode | null) {
		this.val = (val===undefined ? 0 : val)
		this.next = (next===undefined ? null : next)
	}
}
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
	if (list1 === null) {
		return list2;
	} else if (list2 === null) {
		return list1;
	} else if (list1.val < list2.val) {
		list1.next = mergeTwoLists(list1.next, list2);
		return list1;
	} else {
		list2.next = mergeTwoLists(list1, list2.next);
		return list2;
	}
}
