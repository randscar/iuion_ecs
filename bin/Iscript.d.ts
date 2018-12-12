import { Entity } from "./Entity";
import { Inode } from "./Inode";
/** 组件接口 */
export declare class Iscript {
    /** [readonly] node作为对象池存在时，用来快速存取的标识对象 */
    _pool: Inode;
    /** [readonly] 所属实体（如果存在） */
    ent: Entity;
    reset: () => void;
    exec(hName: string): any;
    on(hName: string, cb: any): void;
}
