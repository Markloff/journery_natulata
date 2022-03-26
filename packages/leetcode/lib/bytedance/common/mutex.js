"use strict";
// /**
//  * 请实现一个 Mutex ，达到如下效果
//  */
//
// interface IMutex {
// 	lock(): Promise<() => void>;
// }
//
// class Mutex implements IMutex {
//
// 	private _locked: boolean;
//
//
// 	constructor() {
// 		this._locked = false;
// 	}
//
// 	lock(): Promise<() => void> {
//
// 		return () => {};
// 	}
// }
//
// const mutex = new Mutex();
//
// const logMessage = (message: string, time: number) => {
// 	return new Promise<void>((resolve) => {
// 		setTimeout(() => {
// 			console.log(message);
// 			resolve();
// 		}, time);
// 	})
// }
//
//
// const A = async () => {
// 	const unlock = await mutex.lock();
// 	await logMessage('function A 执行', 5000);
// 	unlock();
// }
//
// const B = async () => {
// 	const unlock = await mutex.lock();
// 	await logMessage('function B 执行', 2000);
// 	unlock();
// }
//
// const C = async () => {
// 	const unlock = await mutex.lock();
// 	await logMessage('function C 执行', 3000);
// 	unlock();
// }
//
// async function main() {
// 	console.log('main start');
// 	await Promise.all([
// 		A(),
// 		B(),
// 		C()
// 	]);
// 	console.log('main done');
// }
//
// main();
