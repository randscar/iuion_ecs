"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Inode_1 = require("./Inode");
var Inodelist_1 = require("./Inodelist");
var Ipool = /** @class */ (function () {
    function Ipool() {
        /** [readonly] 对象池所含数据*/
        this.pool = new Inodelist_1.Inodelist();
        /** 对象池最大容量*/
        this.max = 0;
    }
    Ipool.prototype.init = function (name, max, classType) {
        var s = this;
        s.name = name;
        s.max = max;
        s.classType = classType;
    };
    /**
     * 清空数据
     */
    Ipool.prototype.clear = function () {
        this.pool.clear(this._destroy);
    };
    Ipool.prototype._destroy = function (n) {
        var d = n.udata;
        if (d != null) {
            d.reset();
        }
    };
    Ipool.prototype._creat = function () {
        var ni = new Inode_1.Inode();
        var d = new this.classType();
        d._pool = ni;
        ni.udata = d;
        return ni;
    };
    /**
    * 填充数据
    * @param n 池子补满充到该数量。以池子容量为最大数量限制。
    */
    Ipool.prototype.fill = function (n) {
        var s = this;
        if (s.max > 0 && n > s.max)
            n = s.max;
        for (var i = s.pool.size; i < n; i++) {
            s.pool.push(s._creat());
        }
    };
    /**
     * 放置一个元素到池子中里。如果该元素还存在其他链表中，则会从其他链表中移除。
     * @param o 实现i_base接口的对象
     * @return 返回是否成功放置该数据对象。
     */
    Ipool.prototype.free = function (o) {
        var s = this;
        var n = o._pool;
        if (n.list == s.pool)
            return false;
        o.reset();
        if (s.max == 0 || s.pool.size < s.max) {
            return s.pool.push(n);
        }
        return false;
    };
    /** 获取一个对象*/
    Ipool.prototype.malloc = function () {
        var s = this;
        var r = s.pool.pop();
        if (r == null) {
            r = s._creat();
        }
        return r.udata;
    };
    return Ipool;
}());
exports.Ipool = Ipool;
