"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 * 管理Inode集合的列表对象。
 */
var Inodelist = /** @class */ (function () {
    function Inodelist() {
        /** [readonly] 链表长度*/
        this.size = 0;
    }
    /**
     * 把当前列表的元素全部移动到新的列表末尾。
     * 注意：由于元素同一时间只能存在一个链表中，因此此方法处理结束后，当前列表元素将被清空。
     * @param d 目标链表
     */
    Inodelist.prototype.moveTo = function (d) {
        var f = this;
        if (f.size > 0) {
            d.end = f.end;
            if (d.size == 0) {
                d.start = f.start;
                d.size = f.size;
            }
            else {
                d.size = d.size + f.size;
            }
            var t = f.start;
            t.prev = d.end;
            var n = t;
            while (n != null) {
                t = n.next;
                n.list = d;
                n = t;
            }
            f.start = null;
            f.end = null;
            f.size = 0;
        }
    };
    // /** 清除并销毁所有元素**/
    // public destroy():void{
    //     var d:Inodelist=this;
    //     if (d.size > 0){
    //         var n:Inode = d.start;
    //         var t:Inode = null;
    //         while (n != null){
    //             t = n.next;
    //             n.prev = null;
    //             n.next = null;
    //             n.list = null;
    //             n.destroy();
    //             n = t;
    //         }
    //         d.start = null;
    //         d.end = null;
    //         d.size = 0;
    //     }
    // }
    /** 清除所有元素并对元素作处理**/
    Inodelist.prototype.clear = function (cb) {
        var d = this;
        if (d.size > 0) {
            var n = d.start;
            var t = null;
            while (n != null) {
                t = n.next;
                n.list = null;
                n.prev = null;
                n.next = null;
                if (cb != null) {
                    cb(n);
                }
                n = t;
            }
            d.start = null;
            d.end = null;
            d.size = 0;
        }
    };
    /**
     * 把指定元素插入到当前列表的首位
     * @param n
     * @return
     */
    Inodelist.prototype.unshift = function (n) {
        var d = this;
        var e = d.start;
        if (n == e) {
            return false;
        }
        n.remove();
        if (e != null) {
            n.next = e;
            e.prev = n;
            d.start = n;
            d.size = d.size + 1;
        }
        else {
            this.push_(d, n);
        }
        return true;
    };
    /**
    * 添加一个节点在列表的末尾处。<p></p>
    * 注意：如果元素已经存在其他链表中，则会从其他列表中移除。如果已经在该链表中，则不作处理
    * @param d 要添加的列表
    * @param n 要操作的元素
    * @return 如果为当前列表末尾元素则返回false，否则会先从原来列表中移除（包含自身）添加到当前列表，返回true。
    */
    Inodelist.prototype.push = function (n) {
        var d = this;
        if (n.list == d) {
            return false;
        }
        n.remove();
        this.push_(d, n);
        return true;
    };
    Inodelist.prototype.push_ = function (d, n) {
        d.size = d.size + 1;
        n.list = d;
        if (d.start == null) {
            d.start = n;
            n.prev = null; //正常下这个值应该为null，无需设置。
        }
        else {
            d.end.next = n;
            n.prev = d.end;
        }
        n.next = null; //正常下这个值应该为null，无需设置。
        d.end = n;
    };
    /**
    * 删除一个节点。
    * @param n
    * @return 必须存储在当前链表中才能成功删除。成功删除返回true，否则返回false。
    */
    Inodelist.prototype.remove = function (n) {
        var d = n.list;
        if (d == this) {
            d.size = d.size - 1;
            n.list = null;
            var p = n.prev;
            var e = n.next;
            if (p == null) {
                d.start = e;
            }
            else {
                p.next = e;
                n.prev = null;
            }
            if (e == null) {
                d.end = p;
            }
            else {
                e.prev = p;
                n.next = null;
            }
            return true;
        }
        return false;
    };
    /**
    * 获取指定元素在列表中的索引。
    * @param n
    * @return 如果不存在列表中则返回-1。
    */
    Inodelist.prototype.getIndex = function (n) {
        if (n.list == this) {
            var i = 0;
            var t = n.prev;
            for (; t != null;) {
                i++;
                t = t.prev;
            }
            return i;
        }
        return -1;
    };
    /**
    * 获取指定索引处的元素
    * @param index
    * @return
    */
    Inodelist.prototype.getAt = function (index) {
        var d = this;
        var c = d.size;
        if (index < 0 || index >= c)
            return null;
        var x;
        var i = 0;
        if (index < (c * 0.5)) { //左边
            x = d.start;
            for (; i < index; i++) {
                x = x.next;
            }
        }
        else { //右边
            x = d.end;
            for (i = c - 1; i > index; i--) {
                x = x.prev;
            }
        }
        return x;
    };
    /** 删除列表最后一个元素。**/
    Inodelist.prototype.pop = function () {
        var d = this;
        if (d.size > 0) {
            var e = d.end;
            if (d.remove(e))
                return e;
        }
        return null;
    };
    /** 删除列表第一个元素**/
    Inodelist.prototype.shift = function () {
        var d = this;
        if (d.size > 0) {
            var e = d.start;
            if (d.remove(e))
                return e;
        }
        return null;
    };
    /**
    * 将指定节点插入到指定节点的位置。
    * @param n 要插入的元素。该元素必须不存在与任何Cnodelist列表中才能插入。
    * @param e 用来定位的元素。该元素必须存在于当前Cnodelist列表中才能插入元素n。
    * @return 成功添加才返回true，否则返回false。其他规则同add()。
    */
    Inodelist.prototype.insert = function (n, e) {
        var d = e.list;
        if (d != this)
            return false;
        n.remove();
        if (d.start != e) {
            e.prev.next = n;
        }
        else {
            d.start = n;
        }
        n.prev = e.prev;
        n.next = e;
        n.list = d;
        e.prev = n;
        d.size = d.size + 1;
        return true;
    };
    return Inodelist;
}());
exports.Inodelist = Inodelist;
//# sourceMappingURL=Inodelist.js.map