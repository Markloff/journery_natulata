export declare namespace Cookie {
    function get(name: string): string | undefined;
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
    function set(name: string, value: string | number, domain?: string, path?: string, expire?: number): void;
    function deleteCookie(name: string, domain?: string, path?: string): void;
    function setDirect(str: string): void;
    function getCRSFToken(): number;
}
export declare namespace User {
    function getUin(): string | number;
}
