import { Inodelist } from "./Inodelist";
/** 链表基类。可与Cnodelist搭配使用 */
export declare class Inode {
    /** [readonly] 下一个节点**/
    next: Inode;
    /** [readonly] 上一个节点*/
    prev: Inode;
    /** [readonly] 当前所在的链表。可用以判断是否被链表所拥有。**/
    list: Inodelist;
    /** 自定义数据1。默认为null*/
    udata: any;
    /** 从链表中移除，并执行数据的h方法,传null则不执行 */
    remove(): void;
}
