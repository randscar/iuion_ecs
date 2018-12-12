import { Inode } from "./Inode";
/***
 * 管理Inode集合的列表对象。
 */
export declare class Inodelist {
    /** [readonly] 链表长度*/
    size: number;
    /** [readonly] 第一个元素*/
    start: Inode;
    /** [readonly] 最后一个元素**/
    end: Inode;
    /**
     * 把当前列表的元素全部移动到新的列表末尾。
     * 注意：由于元素同一时间只能存在一个链表中，因此此方法处理结束后，当前列表元素将被清空。
     * @param d 目标链表
     */
    moveTo(d: Inodelist): void;
    /** 清除所有元素并对元素作处理**/
    clear(cb: any): void;
    /**
     * 把指定元素插入到当前列表的首位
     * @param n
     * @return
     */
    unshift(n: Inode): boolean;
    /**
    * 添加一个节点在列表的末尾处。<p></p>
    * 注意：如果元素已经存在其他链表中，则会从其他列表中移除。如果已经在该链表中，则不作处理
    * @param d 要添加的列表
    * @param n 要操作的元素
    * @return 如果为当前列表末尾元素则返回false，否则会先从原来列表中移除（包含自身）添加到当前列表，返回true。
    */
    push(n: Inode): boolean;
    push_(d: Inodelist, n: Inode): void;
    /**
    * 删除一个节点。
    * @param n
    * @return 必须存储在当前链表中才能成功删除。成功删除返回true，否则返回false。
    */
    remove(n: Inode): boolean;
    /**
    * 获取指定元素在列表中的索引。
    * @param n
    * @return 如果不存在列表中则返回-1。
    */
    getIndex(n: Inode): number;
    /**
    * 获取指定索引处的元素
    * @param index
    * @return
    */
    getAt(index: number): Inode;
    /** 删除列表最后一个元素。**/
    pop(): Inode;
    /** 删除列表第一个元素**/
    shift(): any;
    /**
    * 将指定节点插入到指定节点的位置。
    * @param n 要插入的元素。该元素必须不存在与任何Cnodelist列表中才能插入。
    * @param e 用来定位的元素。该元素必须存在于当前Cnodelist列表中才能插入元素n。
    * @return 成功添加才返回true，否则返回false。其他规则同add()。
    */
    insert(n: Inode, e: Inode): boolean;
}
