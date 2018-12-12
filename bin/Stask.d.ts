import { Itask } from "./Itask";
/** 时间处理对象 */
export declare class Stask {
    /** 处理任务剩余等待的时间*/
    private _waitTime;
    private _task;
    private _needSort;
    /**
     * 前系统运行的核心处理功能
     * @param deltaTime 距离上一帧的时间
     * @param timeScale 使用的时间缩放
     * @param cb 调试处理方法，Sys调用使用Sys.doprofile
     * @param callbackProfile 调试处理外部回调方法,参数(time,func,funcArgs)同Sys.callbackProfile
     * @see Sys.callbackProfile
     */
    _update(time: number, deltaTime: number): void;
    private dosort;
    private _onexec;
    /** 获取当前任务中心是否正在运行。**/
    running(): boolean;
    /**
     * 当前帧处理结束后休眠指定时间后自动恢复执行。
     * @param time 小于1则标识立即恢复执行。若要暂停，time=Number.MAX_VALUE即可。
     */
    sleep(time: number): void;
    /** 添加任务对象**/
    extask(task: Itask, delay: number): boolean;
    /** 对任务排序 */
    sort(): void;
    /** 清空全部任务数据**/
    clear(): void;
    /** 待执行任务长度 */
    size(): number;
}
