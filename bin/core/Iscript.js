"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ECS_1 = require("./ECS");
/** 组件接口 */
var Iscript = /** @class */ (function () {
    function Iscript() {
        this.reset = ECS_1.ECS.handNull;
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
//# sourceMappingURL=Iscript.js.map