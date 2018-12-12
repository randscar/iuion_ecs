import { Ipool } from "./Ipool";
import { Inode } from "./Inode";
import { Entity } from "./Entity";
import { Itask } from "./Itask";
import { i_com } from "./i_com";
/**
 * 全部Comp对象池的管理
 * 1.组件id必须是通过getComId生成
 * 2.提供实体与组件的创建、销毁逻辑
 *
*/
export declare class Spool {
    /** [readonly] 组件id**/
    com_id: number;
    /** [readonly] 依据id存储的组件对象池列表**/
    com_pool: Ipool[];
    /**
     * 初始化一个对象池，并依据组件id存储在对应的id列表中。（该方法不作任何逻辑检测.）
     * @param comid 组件id列表
     * @param name 对象池名称
     * @param classType 对象池使用类
     * @param max 对象池容量上限。为0时表示无上限。
     * @return 返回生成的对象池。
     * */
    addPoolComp(comid: number[], name: string, classType: any, max: number): Ipool;
    /** 生成实体的组件自增id */
    makePoolCompId(): number;
    /** [readonly] 任务数据对象池**/
    private _task;
    /** [private] 获取一个任务对象 */
    _getTask(f: Function, thisobj: any, args: any[]): Itask;
    /** 释放一个任务对象并放入对象池。 */
    remTask(t: Itask): boolean;
    /** [private] 删除一个任务对象(不作检测会立即释放到对象池里。) */
    _remTaskByNode(n: Inode): void;
    getTaskPoolSize(): number;
    private _ent;
    /** Entity对象池回收。（非Comp模式数据）*/
    remEntity(n: Entity): boolean;
    /** 获取Entity对象。 （非Comp模式数据）*/
    newEntity(): Entity;
    private _instid;
    /** 添加组件模块 */
    addComp(comid: number, n: Entity): i_com;
    /** 删除组件模块 */
    remComp(comid: number, n: Entity): boolean;
}
