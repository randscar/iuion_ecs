"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ipool_1 = require("./Ipool");
var Inode_1 = require("./Inode");
var Inodelist_1 = require("./Inodelist");
var Entity_1 = require("./Entity");
var Itask_1 = require("./Itask");
var EventID_1 = require("./EventID");
var _cb_1 = require("./_cb");
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
        this._task = new Inodelist_1.Inodelist();
        ///////////Entity与组件逻辑块/////////////////////
        this._ent = new Inodelist_1.Inodelist();
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
        var cb = _cb_1._cb.get(f, thisobj, args);
        var n = this._task.pop();
        var t;
        if (n == null) {
            t = new Itask_1.Itask();
            n = new Inode_1.Inode();
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
            n = new Inode_1.Inode();
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
        e.sendEvent(EventID_1.EventID.init, e, Spool);
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
//# sourceMappingURL=Spool.js.map