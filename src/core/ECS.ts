import { Spool } from "./Spool";
import { Ilog } from "./Ilog";
import { Entity } from "./Entity";
import { Stask } from "./Stask";
import { Itask } from "./Itask";
import { _cbs } from "./_cbs";
import { _mem } from "./_mem";
import { Tool } from "./Tool";
import { _cb } from "./_cb";
import { _lang } from "./_lang";
import { _time } from "./_time";

export class ECS{
    /////////// 常量部分/////////
    public static LOG_NO = 0;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    public static LOG_ERROR = 1;
    /** 常量。警告级别*/
    public static LOG_WARN = 2;
    /** 常量。信息说明级别*/
    public static LOG_INFO = 3;
    /** 常量。调试级别*/
    public static LOG_DEBUG = 4;
    /** 初始化或待机状态 */
    public static STATUS_INIT = 0;
    /** 释放状态*/
    public static STATUS_RELEASE = 1;
    /** 工作状态*/
    public static STATUS_WORK = 2;
    /** 正在工作状态*/
    public static STATUS_ON = 3;
    
    /** 英文 */
    public static en_US:string="en_US";
    /** 中文 */
    public static zh_CN:string="zh_CN";
    


    /////////// 模块部分/////////
    /** [readonly] 是否已经启动**/
    public static isStart:boolean=false;
    /*** [readonly]使用日期的格式 20170928 */
    public static date:string;
    /*** [readonly]使用时间的格式 00:00:00.000 */
    public static datetime:string;
    /** 日志模块 **/
    public static log:Ilog;
    /** [readonly] 对象池 */
    public static pool:Spool;
    ////////////////////////////
    /** [readonly] 获取程序计时器**/
    public static time:_time;
    /** [readonly] 任务运行器**/
    public static task:Stask;
    /** [readonly] later回调处理运行器**/
    public static later:_cbs;
    /** [readonly] 语言模块**/
    public static lang:_lang;
    /*** 全局事件对象 */
    public static event:Entity;

    
    
    /** 当前是否是调试模式 */
    public static debug:boolean=false;
    /** 调试模式下每个方法的执行 */
    public static debug_cb:(f:Function,args:any[])=>void;
    public static start(ms:number){
        if(!ECS.isStart){
            ECS.isStart=true;
            var t=Date.now();
            ECS.log=new Ilog();
            ECS.pool=new Spool();
            ECS.time=new _time();
            ECS.task=new Stask();
            ECS.later=new _cbs();
            ECS.lang=new _lang();
            ECS.event=new Entity();
            ECS.lang.add(ECS.zh_CN,_mem.lang_zh);
            ECS.lang.add(ECS.en_US,_mem.lang_en);
            //启动任务
            ECS.time.start(t);
            ECS._update();
            setInterval(ECS._update,ms);
            t=Date.now()-t;
            //ECS.setInterval(ECS.later.callLater,0);
            ECS.log.info("ecs init complete,task:"+t+"ms");
        }
    }
    /** [private] 更新模块**/
    public static _update():void{
        var time:_time=ECS.time;
        var d:Date=new Date();
        ECS.date=Tool.date_day(d,"");
        ECS.datetime=Tool.date_time(d);

        var n:number=d.getTime();
        var rt=time.frame(n);
        ECS.later.callLater();
        ECS.task._update(time.time,time.deltaTime);
    }
     ////静态方法///
    /**
     * @param delay
     * @param cb
     * @param args
     * @return 
     */		
    public static setTimeOut(cb:Function,thisobj,delay:number,...args):Itask{
        var tc:Itask=ECS.pool._getTask(cb,thisobj,args);
        tc.period=delay;
        tc.restCount=1;
        tc.start(delay,false);
        return tc;
    }
    
    public static setInterval(cb:Function,thisobj,period:number,...args):Itask{
        var tc:Itask=ECS.pool._getTask(cb,thisobj,args);
        tc.period=period;
        tc.start(period,false);
        return tc;
    }
    public static callLater(cb:Function,thisobj,...args):boolean{
        return ECS.later.add(cb,thisobj,args);
    }

    public static handNull=function(){};
}