export declare class Ilog {
    static NO: number;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    static ERROR: number;
    /** 常量。警告级别*/
    static WARN: number;
    /** 常量。信息说明级别*/
    static INFO: number;
    /** 常量。调试级别*/
    static DEBUG: number;
    type: Object;
    level: number;
    /** 外部监听日志处理函数必须包含参数(level:String, o:Object)*/
    log: (nlevel: number, o: any[]) => void;
    /** 信息说明**/
    debug(...args: any[]): void;
    /** 信息说明**/
    info(...args: any[]): void;
    /** 警告**/
    warn(...args: any[]): void;
    /** 错误**/
    error(...args: any[]): void;
}
