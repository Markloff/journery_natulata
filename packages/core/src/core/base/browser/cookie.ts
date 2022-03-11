
export namespace Cookie {

	function filterXss(str: string | undefined): string | undefined {
		if (!str) return str;
		let _str = str;
		for (; _str != decodeURIComponent(str); ) {
			_str = decodeURIComponent(str);
		}
		const r = ['<', '>', "'", '"', '%3c', '%3e', '%27', '%22', '%253c', '%253e', '%2527', '%2522'];
		const n = [
			'&#x3c;',
			'&#x3e;',
			'&#x27;',
			'&#x22;',
			'%26%23x3c%3B',
			'%26%23x3e%3B',
			'%26%23x27%3B',
			'%26%23x22%3B',
			'%2526%2523x3c%253B',
			'%2526%2523x3e%253B',
			'%2526%2523x27%253B',
			'%2526%2523x22%253B'
		];
		for (let i = 0; i < r.length; i++) {
			_str = _str.replace(new RegExp(r[i], 'gi'), n[i]);
		}
		return _str;
	}

	export function get(name: string): string | undefined {
		const match = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)'); // See https://stackoverflow.com/a/25490531
		return match ? filterXss(match.pop()) : undefined;
	}

	/**
	 * 设置一个cookie,还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
	 * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
	 *
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} domain 所在域名
	 * @param {String} path 所在路径
	 * @param {Number} expire 存活时间，单位:小时
	 * @return {Boolean} 是否成功
	 * @example
	 *  cookie.set('value1',$('t1').value,"qzone.qq.com","/v5",24); // 设置cookie
	 */
	export function set(name: string, value: string | number, domain?: string, path?: string, expire?: number) {
		const expireTime = new Date();
		if (expire) {
			expireTime.setTime(expireTime.getTime() + 3600000 * expire);
		}
		document.cookie = `${name}=${value}; ${expire ? `expires=${expireTime.toUTCString()};` : ''}domain=${domain || window.location.host};` + `path=${path || '/'};`;
	}

	export function deleteCookie(name: string, domain?: string, path?: string) {
		document.cookie = `${name}=; expires=Mon, 26 Jul 1997 05:00:00 GMT;path=${path || '/'};domain=${domain || window.location.host};`;
	}

	export function setDirect(str: string): void {
		const value = filterXss(str);
		if (value) {
			document.cookie = value;
		}
	}

	export function getCRSFToken(): number {
		const skey = get('qqmusic_key');
		let hash = 5381;
		if (skey) {
			for (let i = 0, len = skey.length; i < len; ++i) {
				hash += (hash << 5) + skey.charCodeAt(i);
			}
		}
		return hash & 0x7fffffff;
	}

}


export namespace User {

	let uin: string | number = 0;

	export function getUin(): string | number {
		if (uin) {
			return uin;
		}
		let _uin: string | number = Cookie.get('uin') || 0;
		if (typeof _uin === 'string') {
			if (_uin.indexOf('o') === 0) {
				_uin = _uin.substring(1, _uin.length);
			}
		} else {
			if (_uin < 10000) {
				_uin = 0;
			}
		}
		uin = _uin;
		return _uin;
	}

}











