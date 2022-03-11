/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

export function fromNow(date: number | Date, appendAgoLabel?: boolean): string {
	if (typeof date !== 'number') {
		date = date.getTime();
	}

	const seconds = Math.round((new Date().getTime() - date) / 1000);
	if (seconds < -30) {
		return `date.fromNow.in, in ${fromNow(new Date().getTime() + seconds * 1000, false)}`;
	}

	if (seconds < 30) {
		return 'now';
	}

	let value: number;
	if (seconds < minute) {
		value = seconds;

		if (appendAgoLabel) {
			return value === 1
				? `${value} sec ago`
				: `${value} secs ago`;
		} else {
			return value === 1
				? `${value} sec`
				: `${value} secs`;
		}
	}

	if (seconds < hour) {
		value = Math.floor(seconds / minute);
		if (appendAgoLabel) {
			return value === 1
				? `${value} min ago`
				: `${value} mins ago`;
		} else {
			return value === 1
				? `${value} min`
				: `${value} mins`;
		}
	}

	if (seconds < day) {
		value = Math.floor(seconds / hour);
		if (appendAgoLabel) {
			return value === 1
				? `${value} hr ago`
				: `${value} hrs ago`
		} else {
			return value === 1
				? `${value} hr`
				: `${value} hrs`;
		}
	}

	if (seconds < week) {
		value = Math.floor(seconds / day);
		if (appendAgoLabel) {
			return value === 1
				? `${value} day ago`
				: `${value} days ago`;
		} else {
			return value === 1
				? `${value} day`
				: `${value} days`;
		}
	}

	if (seconds < month) {
		value = Math.floor(seconds / week);
		if (appendAgoLabel) {
			return value === 1
				? `${value} wk ago`
				: `${value} wks ago`;
		} else {
			return value === 1
				? `${value} wk`
				: `${value} wks`;
		}
	}

	if (seconds < year) {
		value = Math.floor(seconds / month);
		if (appendAgoLabel) {
			return value === 1
				? `${value} mo ago`
				: `${value} mos ago`;
		} else {
			return value === 1
				? `${value} mo`
				: `${value} mos`;
		}
	}

	value = Math.floor(seconds / year);
	if (appendAgoLabel) {
		return value === 1
			? `${value} yr ago`
			: `${value} yrs ago`;
	} else {
		return value === 1
			? `${value} yr`
			: `${value} yrs`;
	}
}

export function toLocalISOString(date: Date): string {
	return date.getFullYear() +
		'-' + String(date.getMonth() + 1).padStart(2, '0') +
		'-' + String(date.getDate()).padStart(2, '0') +
		'T' + String(date.getHours()).padStart(2, '0') +
		':' + String(date.getMinutes()).padStart(2, '0') +
		':' + String(date.getSeconds()).padStart(2, '0') +
		'.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
		'Z';
}
