export
function clamp(num: number, min: number, max: number) {
	return Math.min(Math.max(num, min), max);
}

export
function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export
function decodeBase64(str: string) {
	const body = Buffer.from(str, 'base64').toString('utf8');
	return JSON.parse(body);
}

export
function encodeBase64(obj: any) {
	const str = JSON.stringify(obj);
	return Buffer.from(str).toString('base64');
}

export
function inRange(num: number, min: number, max: number, inclusive = false) {
	const offset = inclusive ? 1 : 0;
	return ((min - offset) < num && num < (max + offset));
}

export
function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export
function pick<T extends Record<any, any>, K extends keyof T>(object: T, ...ks: K[]): Pick<T, K> {
	return Object.assign(
		{},
		...ks
			.map(key => {
				if (object && Object.prototype.hasOwnProperty.call(object, key)) {
					return { [key]: object[key] };
				}

				return null;
			})
			.filter(isTruthy)
	);
}

export
function exec(fn: () => any | Promise<any>) {
	return fn();
}

export
function defer(fn: () => any | Promise<any>) {
	setTimeout(fn, 1);
}

export
function isTruthy<T>(val: T | null | undefined): val is T {
	return !!val;
}

export
function unique<T>(arr: T[]) {
	return Array.from(new Set(arr));
}

export
function uniqueBy<T>(arr: T[], key: keyof T) {
	return [
		...new Map(
			arr.map(
				item => [item[key], item]
			)
		).values(),
	];
}

export
function random(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export
function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16|0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export
// Source: https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/URLJoin.md
function urlJoin (...args: Array<string | undefined>) {
	return args
		.join('/')
		.replace(/[/]+/g, '/')
		.replace(/^(.+):\//, '$1://')
		.replace(/^file:/, 'file:/')
		.replace(/\/(\?|&|#[^!])/g, '$1')
		.replace(/\?/g, '&')
		.replace('&', '?');
}

export
function objectToArgs(args: any) {
	if(typeof args === 'string' || typeof args === 'number') {
		return args;
	}

	return Object
		.keys(args)
		.map(arg => `${arg}=${encodeURIComponent(args[arg])}`)
		.join('&');
}

export
function keys<T extends Record<any, unknown>>(obj: T): Array<keyof T> {
	return Object.keys(obj);
}

export
function last<T>(arr: T[]): T | null {
	return arr[arr.length - 1] || null;
}

export
function nowISOString() {
	return (new Date()).toISOString();
}

export
function isISOString(str: string) {
	const date = new Date(str);
	return !isNaN(date.getTime()) && date.toISOString() === str;
}

export
function multiplyList<T>(list: T[], multiple: number): T[] {
	return range(multiple).map(() => list).flat();
}

export
function range(size: number, startValue = 0): number[] {
	return [ ...Array(size).keys() ].map(i => i + startValue);
}

export
function swapItems<T>(arr: T[], indexA: number, indexB: number): T[] {
	// TODO Cover edge cases
	const newArr = arr.slice(0);

	[newArr[indexB], newArr[indexA]] = [arr[indexA], arr[indexB]];

	return newArr;
}

export
function moveItemRight<T>(arr: T[], itemIndex: number): T[] {
	if(itemIndex >= arr.length) {
		return arr;
	}

	return swapItems(arr, itemIndex, itemIndex + 1);
}

export
function moveItemLeft<T>(arr: T[], itemIndex: number): T[] {
	if(itemIndex <= 0) {
		return arr;
	}

	return swapItems(arr, itemIndex, itemIndex - 1);
}

export
function removeItem<T>(arr: T[], removeIndex: number): T[] {
	return arr.filter((_, index) => index !== removeIndex);
}

export
function truncate(input: string, maxLen = 50) {
	return input.length > maxLen ?
		`${input.substring(0, maxLen)}…` :
		input;
}

const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export
function makeId(length: number): string {
	return range(length)
		.map(() => ID_CHARS.charAt(random(0, ID_CHARS.length)))
		.join('');
}

export
const NoOp = () => {};

export
function tuple<T extends any[]>(...args: T) {
	return args;
}

type Invalid<T> = ['Needs to be all of', T];

export
// Source https://stackoverflow.com/a/73457231
function arrayOfAll<T extends keyof any>() {
	return (
		<U extends T[]>(
			...array: U & ([T] extends [U[number]] ? unknown : Invalid<T>[])
		) => array
	);
}
