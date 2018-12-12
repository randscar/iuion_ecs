"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 事件类 */
var Ievent = /** @class */ (function () {
    function Ievent() {
        this._stop = false;
        this._evts = new Object();
        this._evtid = [];
    }
    /**
     * 添加事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。包含参数cb(evtid,data,this);
     */
    Ievent.prototype.addEvent = function (evtid, cb) {
        var s = this;
        var r = s._evts[evtid];
        if (r == null) {
            r = [];
            s._evts[evtid] = r;
            s._evtid.push(evtid);
        }
        else if (r.indexOf(cb) >= 0) {
            return;
        }
        r.push(cb);
    };
    /**
     * 删除事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。该值为null时则清空该类型所有事件回调。
     */
    Ievent.prototype.remEvent = function (evtid, cb) {
        var r = this._evts[evtid];
        if (r != null && r.length > 0) {
            if (cb != null) {
                var i = r.indexOf(cb);
                if (i >= 0) {
                    r.splice(i, 1);
                    return true;
                }
            }
            else {
                r.length = 0;
                return true;
            }
        }
        return false;
    };
    /** 获取指定事件类型的回调列表 */
    Ievent.prototype.getEvent = function (evtid) {
        return this._evts[evtid];
    };
    /**
     * 发出指定类型的事件
     * @param evtid 事件类型
     * @param data 事件数据
     * @param target 发送此事件的目标
     * **/
    Ievent.prototype.sendEvent = function (evtid, data, target) {
        var s = this;
        s.target = target;
        var arr = s._evts[evtid];
        if (arr != null && arr.length > 0) {
            s._stop = false;
            for (var i = 0; i < arr.length; i++) {
                arr[i](evtid, data, s);
                if (s._stop)
                    return;
            }
        }
    };
    Ievent.prototype.sendEventD = function (d, data, target) {
        this.sendEvent(d.n, data, target);
    };
    /** 处理事件时停止当前侦听事件的后续执行。**/
    Ievent.prototype.stop = function () {
        this._stop = true;
    };
    /** 清空所有事件 */
    Ievent.prototype.reset = function () {
        var arr = this._evtid;
        if (arr.length > 0) {
            for (var i = arr.length - 1; i >= 0; i--) {
                this._evts[arr[i]].length = 0;
            }
            arr.length = 0;
        }
    };
    return Ievent;
}());
exports.Ievent = Ievent;
