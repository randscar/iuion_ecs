"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 方法回调封装体
 */
var _cb = /** @class */ (function () {
    function _cb() {
        /** [private] 标识状态的数据，0为未使用，1为使用 */
        this.__ = 0;
    }
    /**
     * 根据方法获取一个方法包装对象
     */
    _cb.get = function (f, thisobj, args) {
        var arr = _cb._pools;
        var h;
        if (arr.length > 0) {
            h = arr[arr.length - 1];
            arr.pop();
        }
        else {
            h = new _cb();
        }
        h.thisobj = thisobj;
        h.f = f;
        h.args = args;
        h.__ = 1;
        return h;
    };
    /** 释放对应的方法封装体  */
    _cb.free = function (h) {
        if (h.__ == 1) {
            h.__ = 0;
            h.args = null;
            h.f = null;
            h.thisobj = null;
            _cb._pools.push(h);
            return true;
        }
        return false;
    };
    /** 执行方法（验证方法的状态） */
    _cb.run = function (h) {
        if (h.__ == 0)
            return null;
        return h.f.apply(h.thisobj, h.args);
    };
    /** 执行方法（不验证方法的状态） */
    _cb.run_ = function (h) {
        return h.f.apply(h.thisobj, h.args);
    };
    /** 执行方法并丢回对象池.(会验证方法体的状态) */
    _cb.run2free = function (h) {
        if (h.__ == 0)
            return null;
        var r = h.f.apply(h.thisobj, h.args);
        h.__ = 0;
        h.args = null;
        h.f = null;
        h.thisobj = null;
        _cb._pools.push(h);
        return r;
    };
    _cb._pools = [];
    return _cb;
}());
exports._cb = _cb;
//# sourceMappingURL=_cb.js.map