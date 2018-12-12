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
