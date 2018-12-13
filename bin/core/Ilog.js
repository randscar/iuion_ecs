"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ECS_1 = require("./ECS");
var Ilog = /** @class */ (function () {
    function Ilog() {
        this.type = {
            1: " [error]\t",
            2: " [warn]\t",
            3: " [info]\t",
            4: " [debug]\t"
        };
        this.level = 4; //ECS.LOG_DEBUG
        /** 外部监听日志处理函数必须包含参数(level:String, o:Object)*/
        this.log = function (nlevel, o) {
            var s = this;
            if (nlevel <= s.level) {
                console.log(ECS_1.ECS.datetime + s.type[nlevel] + o.join(" "));
            }
        };
    }
    /** 信息说明**/
    Ilog.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log(4, args);
    };
    /** 信息说明**/
    Ilog.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log(3, args);
    };
    /** 警告**/
    Ilog.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log(2, args);
    };
    /** 错误**/
    Ilog.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log(1, args);
    };
    Ilog.NO = 0;
    /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
    Ilog.ERROR = 1;
    /** 常量。警告级别*/
    Ilog.WARN = 2;
    /** 常量。信息说明级别*/
    Ilog.INFO = 3;
    /** 常量。调试级别*/
    Ilog.DEBUG = 4;
    return Ilog;
}());
exports.Ilog = Ilog;
//# sourceMappingURL=Ilog.js.map