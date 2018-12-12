"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _dd_1 = require("./_dd");
var EventID = /** @class */ (function () {
    function EventID() {
    }
    /** enabled属性发生改变 */
    EventID.enabled_change = new _dd_1._dd(101, "enabled_change");
    /** 初始化 */
    EventID.init = 101;
    /** 更新 */
    EventID.update = 102;
    /** 销毁（如果有对象池则管理，则用以回收到对象池） */
    EventID.destroy = 103;
    /** 添加事件 */
    EventID.add = 1;
    /** 删除事件 */
    EventID.remove = 2;
    /** 改变 */
    EventID.change = 3;
    /** 重新调整 */
    EventID.resize = 4;
    return EventID;
}());
exports.EventID = EventID;
