import { _dd } from "./_dd";

export class EventID{
    /** enabled属性发生改变 */
    public static enabled_change=new _dd(101,"enabled_change");
    /** 初始化 */
    public static init=101;
    /** 更新 */
    public static update=102;
    /** 销毁（如果有对象池则管理，则用以回收到对象池） */    
    public static destroy=103;

    /** 添加事件 */
    public static add=1;
    /** 删除事件 */
    public static remove=2;
    /** 改变 */
    public static change=3;
    /** 重新调整 */
    public static resize=4;
}