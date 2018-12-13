"use strict";
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
        if (c === void 0) { c = 0; }
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
//# sourceMappingURL=dbutil.js.map