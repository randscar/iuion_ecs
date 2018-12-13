"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var ECS_1 = require("./ECS");
var _cbs_1 = require("./_cbs");
var Ievent_1 = require("./Ievent");
var EventID_1 = require("./EventID");
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
//# sourceMappingURL=Entity.js.map