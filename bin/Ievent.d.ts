import { _dd } from "./_dd";
/** 事件类 */
export declare class Ievent {
    private _stop;
    private _evts;
    private _evtid;
    /** 发送事件时的目标对象 */
    target: any;
    /**
     * 添加事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。包含参数cb(evtid,data,this);
     */
    addEvent(evtid: number, cb: Function): void;
    /**
     * 删除事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。该值为null时则清空该类型所有事件回调。
     */
    remEvent(evtid: number, cb: Function): boolean;
    /** 获取指定事件类型的回调列表 */
    getEvent(evtid: any): any[];
    /**
     * 发出指定类型的事件
     * @param evtid 事件类型
     * @param data 事件数据
     * @param target 发送此事件的目标
     * **/
    sendEvent(evtid: number, data: any, target: any): void;
    sendEventD(d: _dd, data: any, target: any): void;
    /** 处理事件时停止当前侦听事件的后续执行。**/
    stop(): void;
    /** 清空所有事件 */
    reset(): void;
}
