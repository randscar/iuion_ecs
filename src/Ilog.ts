import { ECS } from "./ECS";

export class Ilog{
    public static NO = 0;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    public static ERROR = 1;
    /** 常量。警告级别*/
    public static WARN = 2;
    /** 常量。信息说明级别*/
    public static INFO = 3;
    /** 常量。调试级别*/
    public static DEBUG = 4;

    public type:Object={
        1:" [error]\t",
        2:" [warn]\t",
        3:" [info]\t",
        4:" [debug]\t"};

    public level=4;//ECS.LOG_DEBUG
    /** 外部监听日志处理函数必须包含参数(level:String, o:Object)*/
    public log=function(nlevel:number,o:any[]):void{
        var s=this;
        if(nlevel<=s.level){
            console.log(ECS.datetime+s.type[nlevel]+o.join(" "));
        }
    }
    /** 信息说明**/
    debug(...args):void{
        this.log(4,args);
    }
    /** 信息说明**/
    info(...args):void{
        this.log(3,args);
    }
    /** 警告**/
    warn(...args):void{
        this.log(2,args);
    }
    /** 错误**/
    error(...args):void{
        this.log(1,args);
    }
}