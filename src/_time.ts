/**
 * 时间数据管理器。所有时间相关 参数以毫秒为单位。
 */
export class _time{
    /** [readonly] 当前fps(约每0.5秒计算一次)*/
    public fps:number= 60;
    /** [readonly] 总帧数*/
    public frameCount:number = 0;
    /** [readonly] 开始时间*/
    public startTime:number = 0;
    /** [readonly] 从游戏开始到到现在所用的时间（只读,受缩放影响）。 */
    public time:number = 0;
    /** [readonly] 自游戏开始的真实时间（只读,不受缩放影响）。 */
    public realtime:number = 0;
    /** [readonly] 完成最后一帧消耗的时间*/
    public deltaTime:number = 0;
    /** [readonly] 上一次执行的时间点 */
    private _last:number = 0;
    /** 时间缩放 */
    public scale:number=1;
    private _f=0;
    private _t=0;
    /**
     * 每帧处理函数,传入时间为毫秒数.
     * @param now
     * @returns 返回真实时间差。
     */
    public frame(now:number):number
    {
        var s=this;
        var d=now-s._last;
        var r=d;
        if(d<1){
            d=1;
        }else if(d>10000){
            d=10000;
        }
        //s.fps=1000/d;
        s.frameCount++;
        s.realtime=s.realtime+d;
        s._last=now;

        d=d*s.scale;
        s.deltaTime=d;
        s.time=s.time+d;

        d=now-s._t;
        s._f++;
        if(d>=500){
            s.fps=s._f*1000/d;
            s._f=0;
            s._t=now;
        }
        return r;
    }
    /** 启动逻辑*/
    public start(now:number)
    {
        var s=this;
        if(s.startTime==0){
            s.startTime=now;
            s._last=now;
        }
    }
}