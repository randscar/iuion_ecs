/**
 * 语法版本数据存储
 */
export declare class _lang {
    /** [readonly] 全部语言的数据存储**/
    private _strs;
    /** [readonly] 当前语言名称。通过setLang设置数据 */
    langName: string;
    /** [readonly] 当前使用的语言数据**/
    private _obj;
    /** 设置当前翻译的语言名称*/
    setLang(name: string): boolean;
    /** 根据语言名称获取数据 */
    get(langName: string): any;
    /** 添加/覆盖更改 语言数据 */
    add(langName: string, d: Object): void;
    private _i;
    /**
     * 全局多语言翻译函数
     * @param code 要查询的字符串代码
     * @param args 替换字符串中{0}标志的参数列表
     * @returns 返回拼接后的字符串
     */
    tr(code: number, ...args: any[]): any;
}
