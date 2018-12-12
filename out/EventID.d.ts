import { _dd } from "./_dd";
export declare class EventID {
    /** enabled属性发生改变 */
    static enabled_change: _dd;
    /** 初始化 */
    static init: number;
    /** 更新 */
    static update: number;
    /** 销毁（如果有对象池则管理，则用以回收到对象池） */
    static destroy: number;
    /** 添加事件 */
    static add: number;
    /** 删除事件 */
    static remove: number;
    /** 改变 */
    static change: number;
    /** 重新调整 */
    static resize: number;
}
