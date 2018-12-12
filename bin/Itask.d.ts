import { Inode } from "./Inode";
import { _cb } from "./_cb";
/** 任务数据类(必须与Stask结合使用) */
export declare class Itask {
    /** 初始化状态 */
    static INIT: number;
    /** 释放状态*/
    static REM: number;
    /** 工作状态*/
    static WORK: number;
    /** 取消工作状态*/
    static CANCEL: number;
    /** [readonly] 使用的node对象（对象池专用） */
    _pool: Inode;
    /** [readonly] 方法对象*/
    cb: _cb;
    /** [readonly]（作任务对象使用时）下一次处理的时间**/
    _nextExecTime: number;
    /** [readonly] （作任务对象使用时）固定的延迟时间，默认值为0。*/
    period: number;
    /** 任务剩余执行次数。默认值为-1,标识每帧都会执行。大于0为剩余可执行的次数。**/
    restCount: number;
    /** 任务执行完成的回调方法*/
    complete: _cb;
    /**  [readonly] 当前状态，初始与空闲状态：0，赋予任务1，计划执行2,取消执行3 （可与常量比较，外部仅获取）*/
    status: number;
    /** 是否自动释放该对象。默认值为true,即在停止该任务执行时自动回收到对象池。*/
    autoDestroy: boolean;
    /** 销毁所有(如果要确保放入对象池则使用Spool.remTask) */
    reset(): void;
    /**
     * 让当前正在进行的任务睡眠指定的时间。以毫秒为单位
     * @param time 睡眠的时间
     */
    sleep(time: number): void;
    /** 设置任务数据 */
    setcb(cb: _cb): void;
    /** 设置任务完成数据，必须有任务数据才可以设置完成数据 */
    setComplete(complete: _cb): boolean;
    /**
     * 停止任务的执行。
     */
    stop(): void;
    /**
     * 开始处理任务。
     * 注意：任务对象不可添加到其他的Ilist列表中，否则会导致任务功能失效。
     * @param delay 第一次任务处理的延迟，毫秒单位。
     * @param restart 是否重新启动。
     * @return 已经作为任务处理则返回false。
     */
    start(delay: number, restart: boolean): boolean;
}
