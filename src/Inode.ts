import { Inodelist } from "./Inodelist";
/** 链表基类。可与Cnodelist搭配使用 */
export class Inode{
    /** [readonly] 下一个节点**/
    public next:Inode;
    /** [readonly] 上一个节点*/
    public prev:Inode;
    /** [readonly] 当前所在的链表。可用以判断是否被链表所拥有。**/
    public list:Inodelist;
    /** 自定义数据1。默认为null*/
    public udata:any;

    /** 从链表中移除，并执行数据的h方法,传null则不执行 */
    public remove(){
        var s:Inode=this;
        if(s.list!=null){
            s.list.remove(s);
        }
    }
}