/**
 * 时间数据管理器。所有时间相关 参数以毫秒为单位。
 */
export declare class _time {
    /** [readonly] 当前fps(约每0.5秒计算一次)*/
    fps: number;
    /** [readonly] 总帧数*/
    frameCount: number;
    /** [readonly] 开始时间*/
    startTime: number;
    /** [readonly] 从游戏开始到到现在所用的时间（只读,受缩放影响）。 */
    time: number;
    /** [readonly] 自游戏开始的真实时间（只读,不受缩放影响）。 */
    realtime: number;
    /** [readonly] 完成最后一帧消耗的时间*/
    deltaTime: number;
    /** [readonly] 上一次执行的时间点 */
    private _last;
    /** 时间缩放 */
    scale: number;
    private _f;
    private _t;
    /**
     * 每帧处理函数,传入时间为毫秒数.
     * @param now
     * @returns 返回真实时间差。
     */
    frame(now: number): number;
    /** 启动逻辑*/
    start(now: number): void;
}
