import { Spool } from "./Spool";
import { Ilog } from "./Ilog";
import { Entity } from "./Entity";
import { Stask } from "./Stask";
import { Itask } from "./Itask";
import { _cbs } from "./_cbs";
import { _lang } from "./_lang";
import { _time } from "./_time";
export declare class ECS {
    static LOG_NO: number;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    static LOG_ERROR: number;
    /** 常量。警告级别*/
    static LOG_WARN: number;
    /** 常量。信息说明级别*/
    static LOG_INFO: number;
    /** 常量。调试级别*/
    static LOG_DEBUG: number;
    /** 初始化或待机状态 */
    static STATUS_INIT: number;
    /** 释放状态*/
    static STATUS_RELEASE: number;
    /** 工作状态*/
    static STATUS_WORK: number;
    /** 正在工作状态*/
    static STATUS_ON: number;
    /** 英文 */
    static en_US: string;
    /** 中文 */
    static zh_CN: string;
    /** [readonly] 是否已经启动**/
    static isStart: boolean;
    /*** [readonly]使用日期的格式 20170928 */
    static date: string;
    /*** [readonly]使用时间的格式 00:00:00.000 */
    static datetime: string;
    /** 日志模块 **/
    static log: Ilog;
    /** [readonly] 对象池 */
    static pool: Spool;
    /** [readonly] 获取程序计时器**/
    static time: _time;
    /** [readonly] 任务运行器**/
    static task: Stask;
    /** [readonly] later回调处理运行器**/
    static later: _cbs;
    /** [readonly] 语言模块**/
    static lang: _lang;
    /*** 全局事件对象 */
    static event: Entity;
    /** 当前是否是调试模式 */
    static debug: boolean;
    /** 调试模式下每个方法的执行 */
    static debug_cb: (f: Function, args: any[]) => void;
    static start(ms: number): void;
    /** [private] 更新模块**/
    static _update(): void;
    /**
     * @param delay
     * @param cb
     * @param args
     * @return
     */
    static setTimeOut(cb: Function, thisobj: any, delay: number, ...args: any[]): Itask;
    static setInterval(cb: Function, thisobj: any, period: number, ...args: any[]): Itask;
    static callLater(cb: Function, thisobj: any, ...args: any[]): boolean;
    static handNull: () => void;
}
