"use strict";
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
//# sourceMappingURL=tableinfo.js.map