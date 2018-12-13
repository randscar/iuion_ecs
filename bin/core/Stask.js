"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Inodelist_1 = require("./Inodelist");
var ECS_1 = require("./ECS");
var _cb_1 = require("./_cb");
/** 时间处理对象 */
var Stask = /** @class */ (function () {
    function Stask() {
        ///** 任务列表*/
        //private _task:Inodelist=new Inodelist();
        /** 处理任务剩余等待的时间*/
        this._waitTime = 0;
        this._task = new Inodelist_1.Inodelist();
        this._needSort = false;
    }
    /**
     * 前系统运行的核心处理功能
     * @param deltaTime 距离上一帧的时间
     * @param timeScale 使用的时间缩放
     * @param cb 调试处理方法，Sys调用使用Sys.doprofile
     * @param callbackProfile 调试处理外部回调方法,参数(time,func,funcArgs)同Sys.callbackProfile
     * @see Sys.callbackProfile
     */
    Stask.prototype._update = function (time, deltaTime) {
        var s = this;
        if (s._waitTime > 0) {
            s._waitTime = s._waitTime - deltaTime;
            return;
        }
        this._onexec(s._task, time);
        if (s._task.size == 0) {
            //ECS.log.info(ECS.lang.tr(1001));
        }
    };
    Stask.prototype.dosort = function (t) {
        var exec = t.start;
        var next;
        var nexttask;
        var max = t.size;
        var pool = ECS_1.ECS.pool;
    };
    Stask.prototype._onexec = function (t, time) {
        if (this._needSort == true) {
            this._needSort = false;
        }
        var exec = t.start;
        var next;
        var nexttask;
        var max = t.size;
        var pool = ECS_1.ECS.pool;
        var tc = 0;
        var cb = _cb_1._cb.run_;
        for (var i = 0; i < max; i++) {
            var nc = exec.udata;
            next = exec.next;
            if (nc.status == 2) {
                if (time >= nc._nextExecTime) {
                    nc._nextExecTime = nc._nextExecTime + nc.period;
                    tc = nc.restCount;
                    if (tc == -1) {
                        cb(nc.cb);
                    }
                    else {
                        if (tc > 0) {
                            tc = tc - 1;
                            nc.restCount = tc;
                            if (tc == 0) {
                                nc.status = 3;
                                cb(nc.cb);
                                //nc.cb.apply(null,nc.cbargs);
                                if (nc.complete != null) {
                                    cb(nc.complete);
                                }
                            }
                            else {
                                cb(nc.cb);
                            }
                        }
                    }
                }
            }
            else {
                if (nc.autoDestroy) {
                    pool._remTaskByNode(nc._pool);
                }
                else {
                    t.remove(exec);
                }
            }
            exec = next;
            if (exec == null || this._waitTime > 0) {
                return;
            }
        }
    };
    /** 获取当前任务中心是否正在运行。**/
    Stask.prototype.running = function () {
        return this._waitTime < 1;
    };
    /**
     * 当前帧处理结束后休眠指定时间后自动恢复执行。
     * @param time 小于1则标识立即恢复执行。若要暂停，time=Number.MAX_VALUE即可。
     */
    Stask.prototype.sleep = function (time) {
        this._waitTime = time;
    };
    /** 添加任务对象**/
    Stask.prototype.extask = function (task, delay) {
        this._needSort = true;
        task._nextExecTime = ECS_1.ECS.time.time + delay;
        return this._task.push(task._pool);
    };
    /** 对任务排序 */
    Stask.prototype.sort = function () {
        this._needSort = true;
    };
    /** 清空全部任务数据**/
    Stask.prototype.clear = function () {
        var pool = ECS_1.ECS.pool;
        this._task.clear(pool._remTaskByNode.bind(pool));
    };
    /** 待执行任务长度 */
    Stask.prototype.size = function () {
        return this._task.size;
    };
    return Stask;
}());
exports.Stask = Stask;
//# sourceMappingURL=Stask.js.map