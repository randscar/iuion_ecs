"use strict";
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
//# sourceMappingURL=query.js.map