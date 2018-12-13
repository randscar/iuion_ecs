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
        if (log === void 0) { log = null; }
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
        if (orderby === void 0) { orderby = null; }
        if (maxCount === void 0) { maxCount = 0; }
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
//# sourceMappingURL=db.js.map