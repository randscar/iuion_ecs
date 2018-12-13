"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbqueue = /** @class */ (function () {
    function dbqueue() {
        this.count = 1;
        this._a = [];
        this._0 = 0;
    }
    /**  添加方法 */
    dbqueue.prototype.add = function (f) {
        var s = this;
        var a = s._a;
        a[a.length] = f;
        s._next();
    };
    dbqueue.prototype._endcb = function () {
        var s = this;
        var a = s._a;
        var b = s._0;
        if (a.length > 0) {
            a.splice(0, 1);
            s._0 = b - 1;
            s._next();
        }
        else {
            console.error("it must no happed!");
        }
    };
    dbqueue.prototype._next = function () {
        var s = this;
        var a = s._a;
        var b = s._0;
        if (a.length > 0 && b < s.count) {
            s._0 = b + 1;
            a[b](s._endcb.bind(s));
        }
    };
    dbqueue.prototype.size = function () { return this._a.length; };
    return dbqueue;
}());
exports.dbqueue = dbqueue;
//# sourceMappingURL=dbqueue.js.map