"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Spool_1 = require("./Spool");
var Ilog_1 = require("./Ilog");
var Entity_1 = require("./Entity");
var Stask_1 = require("./Stask");
var _cbs_1 = require("./_cbs");
var _mem_1 = require("./_mem");
var Tool_1 = require("./Tool");
var _lang_1 = require("./_lang");
var _time_1 = require("./_time");
var ECS = /** @class */ (function () {
    function ECS() {
    }
    ECS.start = function (ms) {
        if (!ECS.isStart) {
            ECS.isStart = true;
            var t = Date.now();
            ECS.log = new Ilog_1.Ilog();
            ECS.pool = new Spool_1.Spool();
            ECS.time = new _time_1._time();
            ECS.task = new Stask_1.Stask();
            ECS.later = new _cbs_1._cbs();
            ECS.lang = new _lang_1._lang();
            ECS.event = new Entity_1.Entity();
            ECS.lang.add(ECS.zh_CN, _mem_1._mem.lang_zh);
            ECS.lang.add(ECS.en_US, _mem_1._mem.lang_en);
            //启动任务
            ECS.time.start(t);
            ECS._update();
            setInterval(ECS._update, ms);
            t = Date.now() - t;
            //ECS.setInterval(ECS.later.callLater,0);
            ECS.log.info("ecs init complete,task:" + t + "ms");
        }
    };
    /** [private] 更新模块**/
    ECS._update = function () {
        var time = ECS.time;
        var d = new Date();
        ECS.date = Tool_1.Tool.date_day(d, "");
        ECS.datetime = Tool_1.Tool.date_time(d);
        var n = d.getTime();
        var rt = time.frame(n);
        ECS.later.callLater();
        ECS.task._update(time.time, time.deltaTime);
    };
    ////静态方法///
    /**
     * @param delay
     * @param cb
     * @param args
     * @return
     */
    ECS.setTimeOut = function (cb, thisobj, delay) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var tc = ECS.pool._getTask(cb, thisobj, args);
        tc.period = delay;
        tc.restCount = 1;
        tc.start(delay, false);
        return tc;
    };
    ECS.setInterval = function (cb, thisobj, period) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var tc = ECS.pool._getTask(cb, thisobj, args);
        tc.period = period;
        tc.start(period, false);
        return tc;
    };
    ECS.callLater = function (cb, thisobj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return ECS.later.add(cb, thisobj, args);
    };
    /////////// 常量部分/////////
    ECS.LOG_NO = 0;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    ECS.LOG_ERROR = 1;
    /** 常量。警告级别*/
    ECS.LOG_WARN = 2;
    /** 常量。信息说明级别*/
    ECS.LOG_INFO = 3;
    /** 常量。调试级别*/
    ECS.LOG_DEBUG = 4;
    /** 初始化或待机状态 */
    ECS.STATUS_INIT = 0;
    /** 释放状态*/
    ECS.STATUS_RELEASE = 1;
    /** 工作状态*/
    ECS.STATUS_WORK = 2;
    /** 正在工作状态*/
    ECS.STATUS_ON = 3;
    /** 英文 */
    ECS.en_US = "en_US";
    /** 中文 */
    ECS.zh_CN = "zh_CN";
    /////////// 模块部分/////////
    /** [readonly] 是否已经启动**/
    ECS.isStart = false;
    /** 当前是否是调试模式 */
    ECS.debug = false;
    ECS.handNull = function () { };
    return ECS;
}());
exports.ECS = ECS;
