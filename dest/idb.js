"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tableinfo_1 = require("./tableinfo");
var dbutil_1 = require("./dbutil");
var query_1 = require("./query");
var dbqueue_1 = require("./dbqueue");
var mysql = require('mysql');
/**
 * mysql 数据库连接池
 * 核心功能。查询立即处理，其他的按队列处理。
 * 注意：所有依赖id查询的必须是数值,否则会被注入。依据名称等其他条件的使用db.findMax()
 * sql表必须第一个字段是主键
 */
var db = /** @class */ (function () {
    function db() {
        /** select处理列表 */
        this._0 = new dbqueue_1.dbqueue();
        /** 处理列表 */
        this._1 = new dbqueue_1.dbqueue();
        /** 按表名存储的tableinfo集合 */
        this.tables = {};
        /** 转义字符 */
        this.escape = mysql.escape;
        /** 查询模块 */
        this.q = new query_1.query();
    }
    /**
     * 关闭所有连接，清除所有数据
     */
    db.prototype.destroy = function () {
        var s = this;
        s.pool.end();
    };
    /** 获取待处理的数据记录 */
    db.prototype.size = function () {
        return this._0.size() + this._1.size();
    };
    /** 连接指定的数据库(dbkey不能有重名的) */
    db.prototype.connect = function (cb, conf, findMaxCount, log) {
        if (log === void 0) {
            log = null;
        }
        var s = this;
        if (s.name != null) {
            cb("It has already connect!");
            return;
        }
        if (typeof conf != "object") {
            conf = {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '',
                database: conf,
                charset: "UTF8_GENERAL_CI"
            };
        }
        var st = Date.now();
        var dbname = conf.database;
        var pool = mysql.createPoolCluster();
        pool.add(dbname, conf);
        s.pool = pool;
        s.conn = pool.of(dbname);
        s.name = dbname;
        var a = [null, null, "show tables"];
        s._add(s._0, s, s.q._sql, a, function (err, result) {
            if (err) {
                cb(err);
            }
            else {
                var field = "Tables_in_" + dbname;
                var t = result.length;
                var i = 0;
                result.forEach(function (ele) {
                    var tname = ele[field];
                    var table = new tableinfo_1.tableinfo();
                    s.tables[tname] = table;
                    var a2 = [null, null, "show full columns from " + tname];
                    i++;
                    //if(log)log("add "+i+" "+tname);
                    s._add(s._0, s, s.q._sql, a2, function (e1, r1) {
                        t--;
                        if (!dbutil_1.dbutil.isKeyPRI(r1[0])) {
                            log(tname + " keypri is not " + r1[0].field);
                        }
                        table.setInfo(s, tname, r1);
                        if (log)
                            log("read table : " + table.tableName);
                        if (t == 0) {
                            cb(null);
                        }
                    });
                });
            }
        });
    };
    db.prototype._add = function (a, s, f, args, cb) {
        a.add(function (qcb) {
            s.getConnection(function (err, connection) {
                if (err) {
                    if (cb)
                        cb(err, null);
                    qcb();
                }
                else {
                    args[0] = function (err, result) {
                        connection.release();
                        if (cb)
                            cb(err, result);
                        qcb();
                    };
                    args[1] = connection;
                    f.apply(null, args);
                }
            });
        });
    };
    /** 查找数据 */
    db.prototype.find = function (cb, tableName, id) {
        var s = this;
        var t = s._check(cb, id, tableName, s);
        if (t != null) {
            s._add(s._0, s, s.q._find.bind(s.q), [null, null, id, t], cb);
        }
    };
    /***
     * 复杂查找
     * cond
     *
     * cond 条件格式 二维数组
     * [
     * ["id","<","1000"],
     * ["vlevel",">",1000"]
     * ]
     */
    db.prototype.findMax = function (cb, tableName, cond, orderby, maxCount) {
        if (orderby === void 0) {
            orderby = null;
        }
        if (maxCount === void 0) {
            maxCount = 0;
        }
        var s = this;
        var t = s.tables[tableName];
        if (t == null) {
            cb(s.name + " has no table with name=" + tableName, null);
            return;
        }
        s._add(s._0, s, s.q._findMax.bind(s.q), [null, null, t, cond, orderby, maxCount], cb);
    };
    /** 更新数据 */
    db.prototype.update = function (cb, d) {
        if (d.__1 == dbutil_1.dbutil.SELECT) {
            var s = this;
            d.__1 = dbutil_1.dbutil.UPDATE;
            s._add(s._1, s, s.q._update.bind(s.q), [null, null, d], cb);
            return true;
        }
        return false;
    };
    /** 插入数据 */
    db.prototype.insert = function (cb, d) {
        if (d.__1 == dbutil_1.dbutil.INIT) {
            d.__1 = dbutil_1.dbutil.INSERT;
            var s = this;
            s._add(s._1, s, s.q._insert.bind(s.q), [null, null, d], cb);
            return true;
        }
        return false;
    };
    /** 删除数据 */
    db.prototype.delete = function (cb, d) {
        var _1 = d.__1;
        if (_1 == dbutil_1.dbutil.INIT)
            return false;
        if (_1 == dbutil_1.dbutil.INSERT) {
            d.__1 = dbutil_1.dbutil.INIT;
        }
        else if (_1 != dbutil_1.dbutil.DELETE) {
            var s = this;
            d.__1 = dbutil_1.dbutil.DELETE;
            s._add(s._1, s, s.q._delete.bind(s.q), [null, null, d], cb);
            return true;
        }
        return false;
    };
    /*** 根据id直接删除数据 */
    db.prototype.deleteId = function (cb, id, tableName) {
        var s = this;
        var t = s._check(cb, id, tableName, s);
        if (t == null)
            return;
        s._add(s._1, s, s.q._sql.bind(s.q), [null, null, t.delete + id, null], cb);
    };
    /** 直接执行sql语句(调用时需要防注入) */
    db.prototype.sql = function (cb, sql, args) {
        var s = this;
        s._add(s._0, s, s.q._sql.bind(s.q), [null, null, sql, args], cb);
    };
    /** 获取链接 */
    db.prototype.getConnection = function (cb) {
        return this.conn.getConnection(cb);
    };
    /** 获取表信息*/
    db.prototype.table = function (tableName) {
        return this.tables[tableName];
    };
    /** 创建新的数据记录 */
    db.prototype.newRow = function (tableName, o) {
        var t = this.tables[tableName];
        if (t != null) {
            dbutil_1.dbutil.newRow(t, o);
        }
        return o;
    };
    /** 数据下所有表的对象 */
    db.prototype.allTables = function () {
        return this.tables;
    };
    db.prototype._check = function (cb, id, tableName, s) {
        if (isNaN(id)) {
            cb("id must be number " + id, null);
            return null;
        }
        var t = s.tables[tableName];
        if (t == null) {
            cb("DB:" + s.name + " do not have a table=" + tableName, null);
            return null;
        }
        return t;
    };
    return db;
}());
exports.db = db;
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
Object.defineProperty(exports, "__esModule", { value: true });
var dbutil = /** @class */ (function () {
    function dbutil() {
    }
    /** 是否是主键 */
    dbutil.isKeyPRI = function (field) {
        return field.Key == "PRI";
    };
    /** 获取数据id */
    dbutil.getid = function (d) {
        var _0 = d.__0;
        return _0.getid(d);
    };
    /**
     *
     * @param field
     * {
     * Collation:"utf8_general_ci",
     * Comment:"说明信息",
     * Extra:"auto_increment",
     * Field:"fieldName",
     * Key:"PRI",
     * Null:"NO",
     * Type:"int(11)"
     * Default:"1970-01-01 00:00:00"
     * }
     */
    dbutil.getDefault = function (field) {
        var t = field.Extra;
        if (t == "auto_increment")
            return 0;
        t = field.Default;
        if (t != null)
            return t;
        t = field.Type;
        if (t.indexOf("int") == 0)
            return 0;
        if (t.indexOf("date") == 0)
            return new Date();
        return null;
    };
    dbutil.hasData = function (d) {
        return d.__1 != dbutil.INIT;
    };
    /** new一条指定表的数据(只有通过该方法增加的数据才能insert插入数据库) */
    dbutil.newRow = function (t, o) {
        var s = this;
        o = o || {};
        o.__0 = t,
            o.__1 = dbutil.INIT;
        var a = t.field_db;
        var n = t.fieldNames;
        for (var i = 0; i < a.length; i++) {
            var k = n[i];
            if (o[k] == null) {
                o[k] = dbutil.getDefault(t.field_db[i]);
            }
        }
        return o;
    };
    /** 设置数据的状态与表信息 state 为dbutil的常量（INIT，INSERT...）*/
    dbutil.setRow = function (d, state, t) {
        d.__0 = t;
        d.__1 = state;
    };
    /** 复制数据 */
    dbutil.cloneRow = function (d) {
        var o = {};
        for (var k in d) {
            o[k] = d[k];
        }
        return o;
    };
    /** 复制数据为普通的obj对象 */
    dbutil.cloneRow2obj = function (d) {
        var o = {};
        for (var k in d) {
            if (k != "__0" && k != "__1") {
                o[k] = d[k];
            }
        }
        return o;
    };
    /** 把一个对象转换为指定表里的数据 */
    dbutil.result2Row = function (d, t) {
        d.__0 = t;
        d.__1 = dbutil.SELECT;
        return d;
    };
    /** 按json格式返回数据库查询数据的内容 */
    dbutil.stringify = function (d, c) {
        if (c === void 0) {
            c = 0;
        }
        return JSON.stringify(d, d.__0.fieldNames, c);
    };
    dbutil.INIT = 0;
    dbutil.INSERT = 1;
    dbutil.SELECT = 2;
    dbutil.UPDATE = 3;
    dbutil.DELETE = 4;
    return dbutil;
}());
exports.dbutil = dbutil;
Object.defineProperty(exports, "__esModule", { value: true });
var dbutil_1 = require("./dbutil");
var query = /** @class */ (function () {
    function query() {
    }
    query.prototype._sql = function (cb, connection, sql, args) {
        connection.query(sql, args, cb);
    };
    /** 把数据d更新到数据库 */
    query.prototype._update = function (cb, connection, d) {
        if (d.__1 != dbutil_1.dbutil.UPDATE) {
            cb(d.__1 + "!=update", d);
            return;
        }
        var s = this;
        var _0 = d.__0; //table
        s._sql(cb, connection, _0.update + _0.getid(d), _0.p_update(d));
    };
    /** 把数据d从数据库删除 */
    query.prototype._delete = function (cb, connection, d) {
        if (d.__1 != dbutil_1.dbutil.DELETE) {
            cb(d.__1 + "!=delete", d);
            return;
        }
        var s = this;
        var _0 = d.__0; //table
        s._sql(cb, connection, d.__0.delete + _0.getid(d), null);
    };
    /** 把数据d插入数据库 */
    query.prototype._insert = function (cb, connection, d) {
        if (d.__1 != dbutil_1.dbutil.INSERT) {
            cb(d.__1 + "!=insert", d);
            return;
        }
        var s = this;
        var _0 = d.__0; //table
        s._sql(function (err, result) {
            if (!err) {
                d[_0.keyName] = result.insertId;
                d.__1 = dbutil_1.dbutil.SELECT;
            }
            cb(err, result);
        }, connection, _0.insert, _0.p_insert(d));
    };
    /***
     * 查询sql语句。unsafe 。调用前确保sql是安全的
     * @param table 查询后的数据归属的表是哪个表
     */
    query.prototype._select = function (cb, connection, sql, args, table) {
        this._sql(function (err, result) {
            if (!err) {
                for (var i = 0; i < result.length; i++) {
                    dbutil_1.dbutil.result2Row(result[i], table);
                }
                cb(err, result);
            }
            else {
                cb(err, sql);
            }
        }, connection, sql, args);
    };
    /** 在table表中查询主键id的数据 */
    query.prototype._find = function (cb, connection, id, table) {
        this._select(cb, connection, table.select + id, null, table);
    };
    /*** 高级查找*/
    query.prototype._findMax = function (cb, connection, table, cond, orderby, maxCount) {
        var s = this;
        var r = table.s_select(cond, orderby, maxCount);
        var a = table.a_select(cond);
        s._select(cb, connection, r, a, table);
    };
    return query;
}());
exports.query = query;
Object.defineProperty(exports, "__esModule", { value: true });
var tableinfo = /** @class */ (function () {
    function tableinfo() {
    }
    /**
     *
     * @param pool
     * @param table
     * @param fieldsInfo
     * {
     * Collation:"utf8_general_ci",
     * Comment:"说明信息",
     * Field:"fieldName",
     * Key:"PRI",
     * Null:"NO",
     * Type:"int(11)"
     * Default:"1970-01-01 00:00:00"
     * }
     */
    tableinfo.prototype.setInfo = function (pool, table, fieldsInfo) {
        var a = [];
        var b = [];
        for (var i = 0; i < fieldsInfo.length; i++) {
            a[i] = fieldsInfo[i].Field;
            b[i] = fieldsInfo[i].Comment;
        }
        var key = fieldsInfo[0].Field;
        var s = this;
        s.keyName = key;
        s.fieldNames = a;
        s.fieldComments = b;
        s.field_db = fieldsInfo;
        s.tableName = table;
        //select * from admin where username='abc’ or 1=1 and password='123’ sql注入式攻击
        s.select = "select * from " + table + " where " + key + "=";
        s.delete = "delete from " + table + " where " + key + "=";
        var t = a[1] + "=?";
        //INSERT INTO t1(field1,field2) VALUES(v101,v102),(v201,v202),(v301,v302),(v401,v402);//可插入批量数据
        //INSERT INTO tableName set field=?,filed=?;//可插入批量数据
        for (var i = 2; i < a.length; i++) {
            t = t + "," + a[i] + "=?";
        }
        s.insert = "insert into " + table + " set " + t;
        //update users set password=?,f1=?,f2=? where name="zhangsan"
        s.update = "update " + table + " set " + t + " where " + key + "="; //
    };
    tableinfo.prototype.getid = function (d) {
        return d[this.keyName];
    };
    tableinfo.prototype.setid = function (d, v) {
        d[this.keyName] = v;
    };
    tableinfo.prototype.p_insert = function (d) {
        return this.p_update(d);
        // var a=this.fieldNames;
        // var r=[0];
        // for(var i=a.length-1;i>0;i--){
        //     r[i]=d[a[i]];
        // }
        // return r;
    };
    tableinfo.prototype.p_update = function (d) {
        var a = this.fieldNames;
        var r = [];
        for (var i = a.length - 1; i > 0; i--) {
            r[i - 1] = d[a[i]];
        }
        return r;
    };
    /**
     * 注意orderby的传入格式
     * @param cond
     * @param orderby ASC：升序（默认），DESC：降序。 fieldName asc fieldName2 desc
     * @param maxCount
     */
    tableinfo.prototype.s_select = function (cond, orderby, maxCount) {
        var r = "select * from " + this.tableName;
        if (cond) {
            r = r + " where ";
            for (var i = 0; i < cond.length; i++) {
                if (i > 0) {
                    r = r + " and ";
                }
                var o = cond[i];
                r = r + "(" + o[0] + " " + o[1] + " ?)";
            }
        }
        if (orderby) {
            r = r + " order by " + orderby;
        }
        if (maxCount && maxCount > 0) {
            r = r + " limit " + maxCount;
        }
        return r;
    };
    tableinfo.prototype.a_select = function (cond) {
        var a = [];
        if (cond) {
            for (var i = 0; i < cond.length; i++) {
                a[i] = cond[i][2];
            }
        }
        return a;
    };
    return tableinfo;
}());
exports.tableinfo = tableinfo;
//# sourceMappingURL=idb.js.map