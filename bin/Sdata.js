"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*** 全部数据管理类 （每条数据需要继承Entity来实现） */
var Sdata = /** @class */ (function () {
    function Sdata() {
        this._d = {};
        this._disableId = [];
    }
    /** 添加数据管理 */
    Sdata.prototype.add = function (id, d) {
        d.instid = id;
        var old = this._d[id];
        if (old != null) {
            console.error(this + " has save data by id:" + id + "=" + old);
        }
        this._d[id] = old;
    };
    /** 根据id获取管理类 */
    Sdata.prototype.get = function (id) {
        return this._d[id];
    };
    return Sdata;
}());
exports.Sdata = Sdata;
