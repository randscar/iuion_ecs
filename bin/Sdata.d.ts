import { Entity } from "./Entity";
/*** 全部数据管理类 （每条数据需要继承Entity来实现） */
export declare class Sdata {
    private _d;
    private _disableId;
    /** 添加数据管理 */
    add(id: number, d: Entity): void;
    /** 根据id获取管理类 */
    get(id: number): Entity;
}
