"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ECS_1 = require("./ECS");
var _cb_1 = require("./_cb");
/** 任务数据类(必须与Stask结合使用) */
var Itask = /** @class */ (function () {
    function Itask() {
        /** [readonly]（作任务对象使用时）下一次处理的时间**/
        this._nextExecTime = 0;
        /** [readonly] （作任务对象使用时）固定的延迟时间，默认值为0。*/
        this.period = 0;
        /** 任务剩余执行次数。默认值为-1,标识每帧都会执行。大于0为剩余可执行的次数。**/
        this.restCount = -1;
        /**  [readonly] 当前状态，初始与空闲状态：0，赋予任务1，计划执行2,取消执行3 （可与常量比较，外部仅获取）*/
        this.status = 0;
        /** 是否自动释放该对象。默认值为true,即在停止该任务执行时自动回收到对象池。*/
        this.autoDestroy = true;
    }
    /** 销毁所有(如果要确保放入对象池则使用Spool.remTask) */
    Itask.prototype.reset = function () {
        var s = this;
        if (s.status != 0) {
            s.status = 0;
            s.period = 0;
            s.restCount = -1;
            s.autoDestroy = true;
            _cb_1._cb.free(s.cb);
            s.cb = null;
            if (s.complete != null) {
                _cb_1._cb.free(s.complete);
                s.complete = null;
            }
        }
    };
    /**
     * 让当前正在进行的任务睡眠指定的时间。以毫秒为单位
     * @param time 睡眠的时间
     */
    Itask.prototype.sleep = function (time) {
        var s = this;
        if (s.status == 2) {
            ECS_1.ECS.task.extask(s, time);
        }
    };
    /** 设置任务数据 */
    Itask.prototype.setcb = function (cb) {
        var ocb = this.cb;
        this.cb = cb;
        if (ocb != null) {
            if (ocb != cb) {
                _cb_1._cb.free(ocb);
            }
        }
        if (cb != null) {
            this.status = 1;
        }
        else {
            this.status = 0;
        }
    };
    /** 设置任务完成数据，必须有任务数据才可以设置完成数据 */
    Itask.prototype.setComplete = function (complete) {
        if (this.status == 0)
            return false;
        var oco = this.complete;
        this.complete = complete;
        if (oco != null) {
            if (oco != complete) {
                _cb_1._cb.free(oco);
            }
        }
        return true;
    };
    /**
     * 停止任务的执行。
     */
    Itask.prototype.stop = function () {
        var s = this;
        if (s.status == 2) {
            s.status = 3;
        }
    };
    /**
     * 开始处理任务。
     * 注意：任务对象不可添加到其他的Ilist列表中，否则会导致任务功能失效。
     * @param delay 第一次任务处理的延迟，毫秒单位。
     * @param restart 是否重新启动。
     * @return 已经作为任务处理则返回false。
     */
    Itask.prototype.start = function (delay, restart) {
        var s = this.status;
        if (s == 0)
            return false;
        if (s == 1 || s == 3 || (s == 2 && restart)) {
            this.status = 2;
            ECS_1.ECS.task.extask(this, delay);
            return true;
        }
        return false;
    };
    /** 初始化状态 */
    Itask.INIT = 0;
    /** 释放状态*/
    Itask.REM = 1;
    /** 工作状态*/
    Itask.WORK = 2;
    /** 取消工作状态*/
    Itask.CANCEL = 3;
    return Itask;
}());
exports.Itask = Itask;
