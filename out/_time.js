"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 时间数据管理器。所有时间相关 参数以毫秒为单位。
 */
var _time = /** @class */ (function () {
    function _time() {
        /** [readonly] 当前fps(约每0.5秒计算一次)*/
        this.fps = 60;
        /** [readonly] 总帧数*/
        this.frameCount = 0;
        /** [readonly] 开始时间*/
        this.startTime = 0;
        /** [readonly] 从游戏开始到到现在所用的时间（只读,受缩放影响）。 */
        this.time = 0;
        /** [readonly] 自游戏开始的真实时间（只读,不受缩放影响）。 */
        this.realtime = 0;
        /** [readonly] 完成最后一帧消耗的时间*/
        this.deltaTime = 0;
        /** [readonly] 上一次执行的时间点 */
        this._last = 0;
        /** 时间缩放 */
        this.scale = 1;
        this._f = 0;
        this._t = 0;
    }
    /**
     * 每帧处理函数,传入时间为毫秒数.
     * @param now
     * @returns 返回真实时间差。
     */
    _time.prototype.frame = function (now) {
        var s = this;
        var d = now - s._last;
        var r = d;
        if (d < 1) {
            d = 1;
        }
        else if (d > 10000) {
            d = 10000;
        }
        //s.fps=1000/d;
        s.frameCount++;
        s.realtime = s.realtime + d;
        s._last = now;
        d = d * s.scale;
        s.deltaTime = d;
        s.time = s.time + d;
        d = now - s._t;
        s._f++;
        if (d >= 500) {
            s.fps = s._f * 1000 / d;
            s._f = 0;
            s._t = now;
        }
        return r;
    };
    /** 启动逻辑*/
    _time.prototype.start = function (now) {
        var s = this;
        if (s.startTime == 0) {
            s.startTime = now;
            s._last = now;
        }
    };
    return _time;
}());
exports._time = _time;
