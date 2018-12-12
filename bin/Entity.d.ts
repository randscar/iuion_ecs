import { Inode } from "./Inode";
import { Ievent } from "./Ievent";
/** 实体类 */
export declare class Entity extends Ievent {
    /** 实体id */
    instid: any;
    /** 实体名称 */
    name: string;
    /** [readonly] 实体组件id(根据comid存储的组件键值对。用数值是为了提供性能) */
    coms: any;
    /** 由对象池使用。 */
    _pool: Inode;
    /** 延迟处理的数据对象列表 */
    private _later;
    private _enabled;
    /** 延迟一帧的处理 */
    callLater(f: Function, thisobj: any, args: any[]): void;
    /** @Override */
    reset(): void;
    setScript(id: number, script: any): void;
    callComs(cbName: string): void;
    /** 改变 激活/禁用 状态。 */
    setEnabled(v: boolean): void;
}
