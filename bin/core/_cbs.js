"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _cb_1 = require("./_cb");
/**
 * 方法处理类
 *
 */
var _cbs = /** @class */ (function () {
    function _cbs() {
        this._s = [];
        this._l = 0;
    }
    /**
     * 添加方法。检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return
     */
    _cbs.prototype.add = function (f, thisobj, args) {
        if (this.get(f, thisobj) == null) {
            var h = _cb_1._cb.get(thisobj, f, args);
            this._s.push(h);
            return true;
        }
        return false;
    };
    /**
     * 添加方法。不检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return
     */
    _cbs.prototype.add_ = function (f, thisobj, args) {
        var h = _cb_1._cb.get(thisobj, f, args);
        this._s.push(h);
    };
    /**
     * 获取包含指定的thisobj与方法的 方法体
     * @param f
     * @param thisobj
     * @return
     */
    _cbs.prototype.get = function (f, thisobj) {
        var s = this._s;
        for (var i = s.length - 1; i >= 0; i--) {
            var r = s[i];
            if (r.f == f && r.thisobj == thisobj) {
                return r;
            }
        }
        return r;
    };
    /**
     * 处理所有添加的方法。(在处理的方法中添加的会在下一帧才处理)
     */
    _cbs.prototype.callLater = function () {
        var s = this._s;
        var max = s.length;
        if (max > 0) {
            this._l = max;
            for (var i = 0; i < max; i++) {
                _cb_1._cb.run2free(s[i]);
            }
            s.splice(0, max);
            this._l = 0;
        }
    };
    /** 执行第一个方法 */
    _cbs.prototype.cbFrame = function () {
        var s = this._s;
        var max = s.length;
        var r = null;
        if (max > 0) {
            r = _cb_1._cb.run2free(s[0]);
            s.splice(0, 1);
        }
        return r;
    };
    /**
     * 清空所有数据
     */
    _cbs.prototype.reset = function () {
        var s = this._s;
        for (var i = s.length - 1; i >= 0; i--) {
            _cb_1._cb.free(s[i]);
        }
        s.length = 0;
    };
    /**
     * 获取要执行的方法长度
     * @return
     */
    _cbs.prototype.size = function () {
        return this._s.length;
    };
    return _cbs;
}());
exports._cbs = _cbs;
//# sourceMappingURL=_cbs.js.map