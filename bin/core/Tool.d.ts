/** 工具类 */
export declare class Tool {
    /***
     * 替换字符串中全部指定的内容
     * @param v 原始字符串
     * @param f 要被替换的字符串 如"<br>"
     * @param r 要替换的字符串 如"\n"
     * @return 返回一个新的字符串。
     */
    static str_replaceAll(v: string, f: string, r: string): string;
    /***
     * 字符串数据补充。str_add("1",3,"0",true)则会返回字符串"001"。
     * @param v 原始字符串
     * @param addstr 补充的内容
     * @param before 补充在原始字符串前还是字符串后
     * @return 返回一个新的字符串。
     */
    static str_add(v: string, size: number, addstr: string, before: boolean): string;
    /**
     * 格式化字符串。
     * @param s
     * @param args
     * @param argi
     * @return
     */
    static str_format(s: string, args: any[], argi: number): string;
    static str_format2(s: string, ...args: any[]): string;
    /**
     * 数组数据随机排列。
     * @param o
     */
    static shuf(o: any[]): void;
    /**
     * 数组浅复制。
     * @param arr 数据源
     * @param res 结果数组
     * @return
     */
    static copy(arr: any[], res: any[]): any[];
    /***
     * 返回格式化的时间yyyy-MM-dd HH:mm:ss.SSS (2017-09-28 15:00:36.138)
     */
    static date_day(d: Date, p: string): string;
    /** 获取Date的时间字符串00:00:00.000 */
    static date_time(d: Date): string;
    /**  */
    static size_1024b(n: any, fix: any): string;
}
