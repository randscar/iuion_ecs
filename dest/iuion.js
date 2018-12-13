var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("_cb", ["require", "exports"], function (require, exports) {
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
});
define("_cbs", ["require", "exports", "_cb"], function (require, exports, _cb_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("_dd", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 数字，字符串都标识同一数据的包装体
     */
    var _dd = /** @class */ (function () {
        function _dd(_n, _s) {
            this.n = _n;
            this.s = _s;
            this.d = this;
        }
        return _dd;
    }());
    exports._dd = _dd;
});
define("_lang", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 语法版本数据存储
     */
    var _lang = /** @class */ (function () {
        function _lang() {
            /** [readonly] 全部语言的数据存储**/
            this._strs = new Object();
            this._i = ["{0}", "{1}", "{2}", "{3}", "{4}", "{5}"];
        }
        /** 设置当前翻译的语言名称*/
        _lang.prototype.setLang = function (name) {
            var s = this;
            if (s.langName != name) {
                var d = s._strs[name];
                if (d != null) {
                    s._obj = d;
                    s.langName = name;
                    return true;
                }
            }
            return false;
        };
        /** 根据语言名称获取数据 */
        _lang.prototype.get = function (langName) {
            return this._strs[langName];
        };
        /** 添加/覆盖更改 语言数据 */
        _lang.prototype.add = function (langName, d) {
            this._strs[langName] = d;
        };
        /**
         * 全局多语言翻译函数
         * @param code 要查询的字符串代码
         * @param args 替换字符串中{0}标志的参数列表
         * @returns 返回拼接后的字符串
         */
        _lang.prototype.tr = function (code) {
            var args = [];
            for (var _a = 1; _a < arguments.length; _a++) {
                args[_a - 1] = arguments[_a];
            }
            var s = this;
            var text = s._obj[code];
            if (!text) {
                return code;
            }
            var length = args.length;
            for (var i = 0; i < length; i++) {
                text = text.replace(s._i[i], args[i]);
            }
            return text;
        };
        return _lang;
    }());
    exports._lang = _lang;
});
define("_mem", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 用来存储程序充常用的数据
     */
    var _mem = /** @class */ (function () {
        function _mem() {
        }
        _mem.lang_zh = {
            1001: "这是1001错误"
        };
        _mem.lang_en = {
            1001: "this is 1001 error"
        };
        return _mem;
    }());
    exports._mem = _mem;
});
define("_time", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 时间数据管理器。所有时间相关 参数以毫秒为单位。
     */
    var _time = /** @class */ (function () {
        function _time() {
            /** [readonly] 当前fps(约每0.5秒计算一次)*/
            this.fps = 60;
            /** [readonly] 总帧数*/
            this.frameCount = 0;
            /** [readonly] 开始时间*/
            this.startTime = 0;
            /** [readonly] 从游戏开始到到现在所用的时间（只读,受缩放影响）。 */
            this.time = 0;
            /** [readonly] 自游戏开始的真实时间（只读,不受缩放影响）。 */
            this.realtime = 0;
            /** [readonly] 完成最后一帧消耗的时间*/
            this.deltaTime = 0;
            /** [readonly] 上一次执行的时间点 */
            this._last = 0;
            /** 时间缩放 */
            this.scale = 1;
            this._f = 0;
            this._t = 0;
        }
        /**
         * 每帧处理函数,传入时间为毫秒数.
         * @param now
         * @returns 返回真实时间差。
         */
        _time.prototype.frame = function (now) {
            var s = this;
            var d = now - s._last;
            var r = d;
            if (d < 1) {
                d = 1;
            }
            else if (d > 10000) {
                d = 10000;
            }
            //s.fps=1000/d;
            s.frameCount++;
            s.realtime = s.realtime + d;
            s._last = now;
            d = d * s.scale;
            s.deltaTime = d;
            s.time = s.time + d;
            d = now - s._t;
            s._f++;
            if (d >= 500) {
                s.fps = s._f * 1000 / d;
                s._f = 0;
                s._t = now;
            }
            return r;
        };
        /** 启动逻辑*/
        _time.prototype.start = function (now) {
            var s = this;
            if (s.startTime == 0) {
                s.startTime = now;
                s._last = now;
            }
        };
        return _time;
    }());
    exports._time = _time;
});
define("Inodelist", ["require", "exports"], function (require, exports) {
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
});
define("Inode", ["require", "exports"], function (require, exports) {
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
});
define("i_base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Ipool", ["require", "exports", "Inode", "Inodelist"], function (require, exports, Inode_1, Inodelist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("Ievent", ["require", "exports"], function (require, exports) {
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
});
define("EventID", ["require", "exports", "_dd"], function (require, exports, _dd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventID = /** @class */ (function () {
        function EventID() {
        }
        /** enabled属性发生改变 */
        EventID.enabled_change = new _dd_1._dd(101, "enabled_change");
        /** 初始化 */
        EventID.init = 101;
        /** 更新 */
        EventID.update = 102;
        /** 销毁（如果有对象池则管理，则用以回收到对象池） */
        EventID.destroy = 103;
        /** 添加事件 */
        EventID.add = 1;
        /** 删除事件 */
        EventID.remove = 2;
        /** 改变 */
        EventID.change = 3;
        /** 重新调整 */
        EventID.resize = 4;
        return EventID;
    }());
    exports.EventID = EventID;
});
define("Entity", ["require", "exports", "ECS", "_cbs", "Ievent", "EventID"], function (require, exports, ECS_1, _cbs_1, Ievent_1, EventID_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 实体类 */
    var Entity = /** @class */ (function (_super) {
        __extends(Entity, _super);
        function Entity() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** [readonly] 实体组件id(根据comid存储的组件键值对。用数值是为了提供性能) */
            _this.coms = [];
            /** 延迟处理的数据对象列表 */
            _this._later = new _cbs_1._cbs();
            _this._enabled = true;
            return _this;
        }
        /** 延迟一帧的处理 */
        Entity.prototype.callLater = function (f, thisobj, args) {
            var l = this._later;
            if (!l.get(f, thisobj)) {
                l.add(thisobj, f, args);
                ECS_1.ECS.callLater(l.callLater, l);
            }
        };
        /** @Override */
        Entity.prototype.reset = function () {
            this.callComs("reset");
            this._later.reset();
            _super.prototype.reset.call(this);
        };
        Entity.prototype.setScript = function (id, script) {
            this.coms[id] = script;
        };
        Entity.prototype.callComs = function (cbName) {
            this.coms.forEach(function (element) {
                var h = element[cbName];
                if (h != null)
                    h();
            });
        };
        /** 改变 激活/禁用 状态。 */
        Entity.prototype.setEnabled = function (v) {
            if (this._enabled != v) {
                this._enabled = v;
                this.sendEventD(EventID_1.EventID.enabled_change, v, this);
            }
        };
        return Entity;
    }(Ievent_1.Ievent));
    exports.Entity = Entity;
});
define("Itask", ["require", "exports", "ECS", "_cb"], function (require, exports, ECS_2, _cb_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 任务数据类(必须与Stask结合使用) */
    var Itask = /** @class */ (function () {
        function Itask() {
            /** [readonly]（作任务对象使用时）下一次处理的时间**/
            this._nextExecTime = 0;
            /** [readonly] （作任务对象使用时）固定的延迟时间，默认值为0。*/
            this.period = 0;
            /** 任务剩余执行次数。默认值为-1,标识每帧都会执行。大于0为剩余可执行的次数。**/
            this.restCount = -1;
            /**  [readonly] 当前状态，初始与空闲状态：0，赋予任务1，计划执行2,取消执行3 （可与常量比较，外部仅获取）*/
            this.status = 0;
            /** 是否自动释放该对象。默认值为true,即在停止该任务执行时自动回收到对象池。*/
            this.autoDestroy = true;
        }
        /** 销毁所有(如果要确保放入对象池则使用Spool.remTask) */
        Itask.prototype.reset = function () {
            var s = this;
            if (s.status != 0) {
                s.status = 0;
                s.period = 0;
                s.restCount = -1;
                s.autoDestroy = true;
                _cb_2._cb.free(s.cb);
                s.cb = null;
                if (s.complete != null) {
                    _cb_2._cb.free(s.complete);
                    s.complete = null;
                }
            }
        };
        /**
         * 让当前正在进行的任务睡眠指定的时间。以毫秒为单位
         * @param time 睡眠的时间
         */
        Itask.prototype.sleep = function (time) {
            var s = this;
            if (s.status == 2) {
                ECS_2.ECS.task.extask(s, time);
            }
        };
        /** 设置任务数据 */
        Itask.prototype.setcb = function (cb) {
            var ocb = this.cb;
            this.cb = cb;
            if (ocb != null) {
                if (ocb != cb) {
                    _cb_2._cb.free(ocb);
                }
            }
            if (cb != null) {
                this.status = 1;
            }
            else {
                this.status = 0;
            }
        };
        /** 设置任务完成数据，必须有任务数据才可以设置完成数据 */
        Itask.prototype.setComplete = function (complete) {
            if (this.status == 0)
                return false;
            var oco = this.complete;
            this.complete = complete;
            if (oco != null) {
                if (oco != complete) {
                    _cb_2._cb.free(oco);
                }
            }
            return true;
        };
        /**
         * 停止任务的执行。
         */
        Itask.prototype.stop = function () {
            var s = this;
            if (s.status == 2) {
                s.status = 3;
            }
        };
        /**
         * 开始处理任务。
         * 注意：任务对象不可添加到其他的Ilist列表中，否则会导致任务功能失效。
         * @param delay 第一次任务处理的延迟，毫秒单位。
         * @param restart 是否重新启动。
         * @return 已经作为任务处理则返回false。
         */
        Itask.prototype.start = function (delay, restart) {
            var s = this.status;
            if (s == 0)
                return false;
            if (s == 1 || s == 3 || (s == 2 && restart)) {
                this.status = 2;
                ECS_2.ECS.task.extask(this, delay);
                return true;
            }
            return false;
        };
        /** 初始化状态 */
        Itask.INIT = 0;
        /** 释放状态*/
        Itask.REM = 1;
        /** 工作状态*/
        Itask.WORK = 2;
        /** 取消工作状态*/
        Itask.CANCEL = 3;
        return Itask;
    }());
    exports.Itask = Itask;
});
define("i_com", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Spool", ["require", "exports", "Ipool", "Inode", "Inodelist", "Entity", "Itask", "EventID", "_cb"], function (require, exports, Ipool_1, Inode_2, Inodelist_2, Entity_1, Itask_1, EventID_2, _cb_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 全部Comp对象池的管理
     * 1.组件id必须是通过getComId生成
     * 2.提供实体与组件的创建、销毁逻辑
     *
    */
    var Spool = /** @class */ (function () {
        function Spool() {
            /** [readonly] 组件id**/
            this.com_id = 0;
            /** [readonly] 依据id存储的组件对象池列表**/
            this.com_pool = [];
            ///////////Inode逻辑块/////////////////////
            /** [readonly] 任务数据对象池**/
            this._task = new Inodelist_2.Inodelist();
            ///////////Entity与组件逻辑块/////////////////////
            this._ent = new Inodelist_2.Inodelist();
            this._instid = 0;
        }
        /**
         * 初始化一个对象池，并依据组件id存储在对应的id列表中。（该方法不作任何逻辑检测.）
         * @param comid 组件id列表
         * @param name 对象池名称
         * @param classType 对象池使用类
         * @param max 对象池容量上限。为0时表示无上限。
         * @return 返回生成的对象池。
         * */
        Spool.prototype.addPoolComp = function (comid, name, classType, max) {
            var d = new Ipool_1.Ipool();
            d.init(name, max, classType);
            for (var i = 0; i < comid.length; i++) {
                if (this.com_pool[comid[i]] != null) {
                    console.error("pool has data with comid : " + comid[i] + "");
                }
                this.com_pool[comid[i]] = d;
            }
            return d;
        };
        /** 生成实体的组件自增id */
        Spool.prototype.makePoolCompId = function () {
            var i = this.com_id;
            this.com_id = i + 1;
            return i;
        };
        /** [private] 获取一个任务对象 */
        Spool.prototype._getTask = function (f, thisobj, args) {
            var cb = _cb_3._cb.get(f, thisobj, args);
            var n = this._task.pop();
            var t;
            if (n == null) {
                t = new Itask_1.Itask();
                n = new Inode_2.Inode();
                n.udata = t;
                t._pool = n;
            }
            else {
                t = n.udata;
            }
            t.status = 0;
            t.setcb(cb);
            return n.udata;
        };
        /** 释放一个任务对象并放入对象池。 */
        Spool.prototype.remTask = function (t) {
            t.reset();
            if (t.status != 2) {
                this._task.push(t._pool);
                return true;
            }
            return false;
        };
        /** [private] 删除一个任务对象(不作检测会立即释放到对象池里。) */
        Spool.prototype._remTaskByNode = function (n) {
            n.udata.reset();
            this._task.push(n);
        };
        Spool.prototype.getTaskPoolSize = function () {
            return this._task.size;
        };
        /** Entity对象池回收。（非Comp模式数据）*/
        Spool.prototype.remEntity = function (n) {
            // var c:i_com[]=n.coms;
            // var pools:Ipool[]=this.com_pool;
            // for(var i=0;i<c.length;i++){
            //     var ci:i_com=c[i];
            //     if(ci!=null){
            //         pools[i].free(ci);
            //         c[i]=null;
            //     }
            // }
            if (n._pool.list != this._ent) {
                n.reset();
                n._pool.remove();
                this._ent.push_(this._ent, n._pool);
                return true;
            }
            return false;
        };
        /** 获取Entity对象。 （非Comp模式数据）*/
        Spool.prototype.newEntity = function () {
            var n = this._ent.pop();
            var e;
            if (n == null) {
                n = new Inode_2.Inode();
                e = new Entity_1.Entity();
                e._pool = n;
                n.udata = e;
                var id = this._instid + 1;
                this._instid = id;
                e.instid = id;
            }
            else {
                e = n.udata;
            }
            e.sendEvent(EventID_2.EventID.init, e, Spool);
            return e;
        };
        /** 添加组件模块 */
        Spool.prototype.addComp = function (comid, n) {
            var d = n.coms[comid];
            if (d == null) {
                d = this.com_pool[comid].malloc();
                n.coms[comid] = d;
                d.ent = n;
                d.onuse();
            }
            return d;
        };
        /** 删除组件模块 */
        Spool.prototype.remComp = function (comid, n) {
            var d = n.coms[comid];
            if (d != null) {
                this.com_pool[comid].free(d);
                d.ent = null;
                n.coms[comid] = null;
                return true;
            }
            return false;
        };
        return Spool;
    }());
    exports.Spool = Spool;
});
define("Ilog", ["require", "exports", "ECS"], function (require, exports, ECS_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    console.log(ECS_3.ECS.datetime + s.type[nlevel] + o.join(" "));
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
});
define("Stask", ["require", "exports", "Inodelist", "ECS", "_cb"], function (require, exports, Inodelist_3, ECS_4, _cb_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 时间处理对象 */
    var Stask = /** @class */ (function () {
        function Stask() {
            ///** 任务列表*/
            //private _task:Inodelist=new Inodelist();
            /** 处理任务剩余等待的时间*/
            this._waitTime = 0;
            this._task = new Inodelist_3.Inodelist();
            this._needSort = false;
        }
        /**
         * 前系统运行的核心处理功能
         * @param deltaTime 距离上一帧的时间
         * @param timeScale 使用的时间缩放
         * @param cb 调试处理方法，Sys调用使用Sys.doprofile
         * @param callbackProfile 调试处理外部回调方法,参数(time,func,funcArgs)同Sys.callbackProfile
         * @see Sys.callbackProfile
         */
        Stask.prototype._update = function (time, deltaTime) {
            var s = this;
            if (s._waitTime > 0) {
                s._waitTime = s._waitTime - deltaTime;
                return;
            }
            this._onexec(s._task, time);
            if (s._task.size == 0) {
                //ECS.log.info(ECS.lang.tr(1001));
            }
        };
        Stask.prototype.dosort = function (t) {
            var exec = t.start;
            var next;
            var nexttask;
            var max = t.size;
            var pool = ECS_4.ECS.pool;
        };
        Stask.prototype._onexec = function (t, time) {
            if (this._needSort == true) {
                this._needSort = false;
            }
            var exec = t.start;
            var next;
            var nexttask;
            var max = t.size;
            var pool = ECS_4.ECS.pool;
            var tc = 0;
            var cb = _cb_4._cb.run_;
            for (var i = 0; i < max; i++) {
                var nc = exec.udata;
                next = exec.next;
                if (nc.status == 2) {
                    if (time >= nc._nextExecTime) {
                        nc._nextExecTime = nc._nextExecTime + nc.period;
                        tc = nc.restCount;
                        if (tc == -1) {
                            cb(nc.cb);
                        }
                        else {
                            if (tc > 0) {
                                tc = tc - 1;
                                nc.restCount = tc;
                                if (tc == 0) {
                                    nc.status = 3;
                                    cb(nc.cb);
                                    //nc.cb.apply(null,nc.cbargs);
                                    if (nc.complete != null) {
                                        cb(nc.complete);
                                    }
                                }
                                else {
                                    cb(nc.cb);
                                }
                            }
                        }
                    }
                }
                else {
                    if (nc.autoDestroy) {
                        pool._remTaskByNode(nc._pool);
                    }
                    else {
                        t.remove(exec);
                    }
                }
                exec = next;
                if (exec == null || this._waitTime > 0) {
                    return;
                }
            }
        };
        /** 获取当前任务中心是否正在运行。**/
        Stask.prototype.running = function () {
            return this._waitTime < 1;
        };
        /**
         * 当前帧处理结束后休眠指定时间后自动恢复执行。
         * @param time 小于1则标识立即恢复执行。若要暂停，time=Number.MAX_VALUE即可。
         */
        Stask.prototype.sleep = function (time) {
            this._waitTime = time;
        };
        /** 添加任务对象**/
        Stask.prototype.extask = function (task, delay) {
            this._needSort = true;
            task._nextExecTime = ECS_4.ECS.time.time + delay;
            return this._task.push(task._pool);
        };
        /** 对任务排序 */
        Stask.prototype.sort = function () {
            this._needSort = true;
        };
        /** 清空全部任务数据**/
        Stask.prototype.clear = function () {
            var pool = ECS_4.ECS.pool;
            this._task.clear(pool._remTaskByNode.bind(pool));
        };
        /** 待执行任务长度 */
        Stask.prototype.size = function () {
            return this._task.size;
        };
        return Stask;
    }());
    exports.Stask = Stask;
});
define("Tool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 工具类 */
    var Tool = /** @class */ (function () {
        function Tool() {
        }
        /***
         * 替换字符串中全部指定的内容
         * @param v 原始字符串
         * @param f 要被替换的字符串 如"<br>"
         * @param r 要替换的字符串 如"\n"
         * @return 返回一个新的字符串。
         */
        Tool.str_replaceAll = function (v, f, r) {
            var i = v.indexOf(f);
            if (i < 0)
                return v;
            var rs = "";
            var tp = 0;
            var rl = f.length;
            for (; i >= 0;) {
                rs = rs + v.substring(tp, i) + r;
                tp = i + rl;
                i = v.indexOf(f, tp);
            }
            rs = rs + v.substring(tp);
            return rs;
        };
        /***
         * 字符串数据补充。str_add("1",3,"0",true)则会返回字符串"001"。
         * @param v 原始字符串
         * @param addstr 补充的内容
         * @param before 补充在原始字符串前还是字符串后
         * @return 返回一个新的字符串。
         */
        Tool.str_add = function (v, size, addstr, before) {
            var i = v.length;
            if (i >= size)
                return v;
            var n = addstr.length;
            if (before) {
                for (; i < size; i += n) {
                    v = addstr + v;
                }
            }
            else {
                for (; i < size; i += n) {
                    v = v + addstr;
                }
            }
            return v;
        };
        /**
         * 格式化字符串。
         * @param s
         * @param args
         * @param argi
         * @return
         */
        Tool.str_format = function (s, args, argi) {
            var size = args.length;
            for (; argi < size; argi++) {
                s = Tool.str_replaceAll(s, "{" + argi + "}", args[argi]);
            }
            return s;
        };
        Tool.str_format2 = function (s) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Tool.str_format(s, args, 0);
        };
        /**
         * 数组数据随机排列。
         * @param o
         */
        Tool.shuf = function (o) {
            var len = o.length;
            for (var i = len - 1; i >= 0; i--) {
                var s = o[i];
                var j = Math.floor(Math.random() * len); //index=index>>0取整
                o[i] = o[j];
                o[j] = s;
            }
        };
        /**
         * 数组浅复制。
         * @param arr 数据源
         * @param res 结果数组
         * @return
         */
        Tool.copy = function (arr, res) {
            res.length = 0;
            for (var i = arr.length - 1; i >= 0; i--) {
                res[i] = arr[i];
            }
            return res;
        };
        /***
         * 返回格式化的时间yyyy-MM-dd HH:mm:ss.SSS (2017-09-28 15:00:36.138)
         */
        Tool.date_day = function (d, p) {
            var r = d.getFullYear() + p;
            var m = d.getMonth() + 1;
            var n = d.getDate();
            if (m < 10)
                r = r + "0" + m;
            else
                r = r + m;
            r = r + p;
            if (n < 10)
                r = r + "0" + n;
            else
                r = r + n;
            return r;
        };
        /** 获取Date的时间字符串00:00:00.000 */
        Tool.date_time = function (d) {
            var r = "";
            var h = d.getHours();
            var i = d.getMinutes();
            var j = d.getSeconds();
            var k = d.getMilliseconds();
            if (h < 10)
                r = r + "0" + h;
            else
                r = r + h;
            r = r + ":";
            if (i < 10)
                r = r + "0" + i;
            else
                r = r + i;
            r = r + ":";
            if (j < 10)
                r = r + "0" + j;
            else
                r = r + j;
            r = r + ".";
            if (k < 10)
                r = r + "00" + k;
            else if (k < 100)
                r = r + "0" + k;
            else
                r = r + k;
            return r;
        };
        /**  */
        Tool.size_1024b = function (n, fix) {
            if (n < 1024)
                return n + "B";
            var v = 1024;
            if (n < v * 1024)
                return (n / v).toFixed(fix) + "KB";
            v = v * 1024;
            if (n < v * 1024)
                return (n / v).toFixed(fix) + "MB";
            v = v * 1024;
            if (n < v * 1024)
                return (n / v).toFixed(fix) + "GB";
            v = v * 1024;
            return (n / v).toFixed(fix) + "TB";
        };
        return Tool;
    }());
    exports.Tool = Tool;
});
define("ECS", ["require", "exports", "Spool", "Ilog", "Entity", "Stask", "_cbs", "_mem", "Tool", "_lang", "_time"], function (require, exports, Spool_1, Ilog_1, Entity_2, Stask_1, _cbs_2, _mem_1, Tool_1, _lang_1, _time_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                ECS.later = new _cbs_2._cbs();
                ECS.lang = new _lang_1._lang();
                ECS.event = new Entity_2.Entity();
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
});
define("Iscript", ["require", "exports", "ECS"], function (require, exports, ECS_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 组件接口 */
    var Iscript = /** @class */ (function () {
        function Iscript() {
            this.reset = ECS_5.ECS.handNull;
        }
        Iscript.prototype.exec = function (hName) {
            var h = this[hName];
            if (h != null) {
                return h();
            }
        };
        Iscript.prototype.on = function (hName, cb) {
            this[hName] = cb;
        };
        return Iscript;
    }());
    exports.Iscript = Iscript;
});
define("Sdata", ["require", "exports"], function (require, exports) {
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
});
define("Transition", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 缓动类方法 */
    var Transition = /** @class */ (function () {
        function Transition() {
        }
        /**
         * 线性移动。（等同匀速移动）
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.linear_none = function (t, c, b) {
            return c * t + b;
        };
        /**
         * 平方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quad_in = function (t, c, b) {
            return c * t * t + b;
        };
        /**
         * 平方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quad_out = function (t, c, b) {
            return c * t * (2 - t) + b;
        };
        /**
         * 平方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quad_both = function (t, c, b) {
            if (t < 0.5)
                return c * 2 * t * t + b;
            return c * (2 * t * (2 - t) - 1) + b;
        };
        /**
         * 立方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.cubic_in = function (t, c, b) {
            return c * t * t * t + b;
        };
        /**
         * 立方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.cubic_out = function (t, c, b) {
            t--;
            return c * (t * t * t + 1) + b;
        };
        /**
         * 立方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.cubic_both = function (t, c, b) {
            if (t < 0.5)
                return c * 4 * t * t * t + b;
            t--;
            return c * (4 * t * t * t + 1) + b;
        };
        /**
         * 四次方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quart_in = function (t, c, b) {
            return c * t * t * t * t + b;
        };
        /**
         * 四次方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quart_out = function (t, c, b) {
            t--;
            return c * (1 - t * t * t * t) + b;
        };
        /**
         * 四次方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quart_both = function (t, c, b) {
            if (t < 0.5)
                return c * 8 * t * t * t * t + b;
            t--;
            return c * (1 - 8 * t * t * t * t) + b;
        };
        /**
         * 五次方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quint_in = function (t, c, b) {
            return c * t * t * t * t * t + b;
        };
        /**
         * 五次方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quint_out = function (t, c, b) {
            t--;
            return c * (t * t * t * t * t + 1) + b;
        };
        /**
         * 五次方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.quint_both = function (t, c, b) {
            if (t < 0.5)
                return c * 16 * t * t * t * t * t + b;
            t--;
            return c * (16 * t * t * t * t * t + 1) + b;
        };
        /**
         * 正弦缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.sine_in = function (t, c, b) {
            return c - c * Math.cos(t * Transition._pi2) + b;
        };
        /**
         * 正弦缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.sine_out = function (t, c, b) {
            return c * Math.sin(t * Transition._pi2) + b;
        };
        /**
         * 正弦缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.sine_both = function (t, c, b) {
            return c * 0.5 * (1 - Math.cos(Math.PI * t)) + b;
        };
        /**
         * 指数缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.expo_in = function (t, c, b) {
            if (t == 0)
                return b;
            return c * Math.pow(2, 10 * (t - 1)) + b;
        };
        /**
         * 指数缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.expo_out = function (t, c, b) {
            if (t == 1)
                return c + b;
            return c * (1 - Math.pow(2, -10 * t)) + b;
        };
        /**
         * 指数缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.expo_both = function (t, c, b) {
            if (t == 0)
                return b;
            if (t == 1)
                return c + b;
            if (t < 0.5)
                return c * 0.5 * Math.pow(2, 20 * t - 10) + b;
            return c * 0.5 * (2 - Math.pow(2, 10 - 20 * t)) + b;
        };
        /**
         * Circular 迂回缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.circ_in = function (t, c, b) {
            return c * (1 - Math.sqrt(1 - t * t)) + b;
        };
        /**
         * Circular 迂回缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.circ_out = function (t, c, b) {
            return c * Math.sqrt((2 - t) * t) + b;
        };
        /**
         * Circular 迂回缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.circ_both = function (t, c, b) {
            if (t < 0.5)
                return c * 0.5 * (1 - Math.sqrt(1 - 4 * t * t)) + b;
            t = t * 2 - 2;
            return c * 0.5 * (Math.sqrt(1 - t * t) + 1) + b;
        };
        /**
         * 弹回缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.elastic_in = function (t, c, b) {
            if (t == 0)
                return b;
            if (t == 1)
                return c + b;
            return -c * Math.pow(2, 10 * t - 10) * Math.sin((3.33 * t - 3.58) * Transition._2pi) + b;
        };
        /**
         * 弹回缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.elastic_out = function (t, c, b) {
            if (t == 0)
                return b;
            if (t == 1)
                return c + b;
            return c * (Math.pow(2, -10 * t) * Math.sin((3.33 * t - 0.25) * Transition._2pi) + 1) + b;
        };
        /**
         * 弹回缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.elastic_both = function (t, c, b) {
            if (t == 0)
                return b;
            if (t == 1)
                return c + b;
            if (t < 0.5)
                return -c * 0.5 * Math.pow(2, 20 * t - 10) * Math.sin((4.45 * t - 2.475) * Transition._2pi) + b;
            return c * (Math.pow(2, 10 - 20 * t) * Math.sin((4.45 * t - 2.475) * Transition._2pi) * 0.5 + 1) + b;
        };
        /**
         * 后退缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.back_in = function (t, c, b) {
            return c * t * t * (2.70158 * t - 1.70158) + b;
        };
        /**
         * 后退缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.back_out = function (t, c, b) {
            t--;
            return c * (t * t * (2.70158 * t + 1.70158) + 1) + b;
        };
        /**
         * 后退缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.back_both = function (t, c, b) {
            if (t < 0.5)
                return c * t * t * (14.379636 * t - 5.189818) + b;
            t--;
            return c * (t * t * (14.379636 * t + 5.189818) + 1) + b;
        };
        /**
         * 弹性缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.bounce_in = function (t, c, b) {
            if (t > 0.636364) {
                t = 1 - t;
                return c * (1 - 7.5625 * t * t) + b;
            }
            if (t > 0.27273) {
                t = 0.454546 - t;
                return c * (0.25 - 7.5625 * t * t) + b;
            }
            if (t > 0.090909) {
                t = 0.181818 - t;
                return c * (0.0625 - 7.5625 * t * t) + b;
            }
            t = 0.045455 - t;
            return c * (0.015625 - 7.5625 * t * t) + b;
        };
        /**
         * 弹性缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.bounce_out = function (t, c, b) {
            if (t < 0.363636)
                return c * 7.5625 * t * t + b;
            if (t < 0.72727) {
                t = t - 0.545454;
                return c * (7.5625 * t * t + 0.75) + b;
            }
            if (t < 0.909091) {
                t -= 0.818182;
                return c * (7.5625 * t * t + 0.9375) + b;
            }
            t = t - 0.954545;
            return c * (7.5625 * t * t + 0.984375) + b;
        };
        /**
         * 弹性缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        Transition.bounce_both = function (t, c, b) {
            if (t < 0.045455) {
                t = 0.045455 - t * 2;
                return c * (0.007813 - 3.78125 * t * t) + b;
            }
            if (t < 0.136365) {
                t = 0.181818 - t * 2;
                return c * (0.03125 - 3.78125 * t * t) + b;
            }
            if (t < 0.318182) {
                t = 0.454546 - t * 2;
                return c * (0.125 - 3.78125 * t * t) + b;
            }
            if (t < 0.5) {
                t = 1 - t * 2;
                return c * (0.5 - 3.78125 * t * t) + b;
            }
            // bounce out  
            if (t < 0.681818) {
                t = t * 2 - 1;
                return c * (3.78125 * t * t + 0.5) + b;
            }
            else if (t < 0.863635) {
                t = t * 2.0 - 1.545454;
                return c * (3.78125 * t * t + 0.875) + b;
            }
            else if (t < 0.954546) {
                t = t * 2 - 1.818182;
                return c * (3.78125 * t * t + 0.96875) + b;
            }
            t = t * 2 - 1.954545;
            return c * (3.78125 * t * t + 0.992188) + b;
        };
        /**
         * 贝塞尔二次曲线
         * @param t 时间0-1
         * @param c 控制值
         * @param b 起始值
         * @param d 目标值
         * @return
         */
        Transition.q_bezier = function (t, c, b, d) {
            return (1 - t) * (1 - t) * b + 2 * t * (1 - t) * c + t * t * d;
        };
        Transition._pi2 = Math.PI * 0.5;
        Transition._2pi = Math.PI * 2;
        return Transition;
    }());
    exports.Transition = Transition;
});
define("uintc", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 可以压缩一组id数组。（适用于无序列要求的数组列表）
     */
    var uintc = /** @class */ (function () {
        function uintc() {
        }
        uintc.prototype.init = function (id) {
            this.value = 0;
            this.add(id);
        };
        uintc.prototype.add = function (id) {
            var s = this;
            var r = (id / 32) >> 0;
            r = r * 32;
            var g = (s.key != r);
            if (g) {
                s.key = r;
                s.value = 0;
            }
            r = id - s.key;
            s.value = (1 << r) | s.value;
            return g;
        };
        /** (数据解压)把单条数据解析成id列表，存储在idsave里 key必须是32的倍数(kv)是一个连续的key,value数组 */
        uintc.decode = function (kv, ids) {
            for (var j = 0; j < kv.length; j += 2) {
                var k = kv[j];
                var v = kv[j + 1];
                for (var i = 0; i < 32; i++) {
                    if (((v >> i) & 1) == 1) {
                        ids.push(i + k);
                    }
                }
            }
        };
        /** (数据压缩)把一组id编码成idsave列表 */
        uintc.compress_uint = function (ids, save) {
            if (ids.length == 0)
                return;
            ids.sort();
            var uc = uintc.uc;
            uc.init(ids[0]);
            save.push(uc.key);
            save.push(uc.value);
            for (var i = 0; i < ids.length; i++) {
                if (uc.add(ids[i])) {
                    save.push(uc.key);
                    save.push(uc.value);
                }
                else {
                    save[save.length - 1] = uc.value;
                }
            }
        };
        /** (数据添加)向已有的kv数组里添加一个新的id(高效) */
        uintc.compress_uint_add = function (kv, id) {
            var uc = uintc.uc;
            uc.init(id);
            var i = kv.indexOf(uc.key) + 1;
            if (i > 0) {
                uc.value = kv[i];
                uc.add(id);
                kv[i] = uc.value;
            }
            else {
                kv.push(uc.key);
                kv.push(uc.value);
            }
        };
        uintc.uc = new uintc();
        return uintc;
    }());
    exports.uintc = uintc;
});
//# sourceMappingURL=iuion.js.map