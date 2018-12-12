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
