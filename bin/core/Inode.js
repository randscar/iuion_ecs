"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 链表基类。可与Cnodelist搭配使用 */
var Inode = /** @class */ (function () {
    function Inode() {
    }
    /** 从链表中移除，并执行数据的h方法,传null则不执行 */
    Inode.prototype.remove = function () {
        var s = this;
        if (s.list != null) {
            s.list.remove(s);
        }
    };
    return Inode;
}());
exports.Inode = Inode;
//# sourceMappingURL=Inode.js.map