import { Inode } from "./Inode";
/** 组件接口 */
export interface i_base{
    /** [readonly] node作为对象池存在时，用来快速存取的标识对象 */
    _pool:Inode;
    /** 重置（可销毁也可用于放置于对象池） */
    reset():void;

    /** 开始使用（从对象池取出时的回调） */
    onuse():void;
}