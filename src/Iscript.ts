import { Entity } from "./Entity";
import { Inode } from "./Inode";
import { ECS } from "./ECS";
/** 组件接口 */
export class Iscript{
    /** [readonly] node作为对象池存在时，用来快速存取的标识对象 */
    _pool:Inode;
    /** [readonly] 所属实体（如果存在） */
    ent:Entity;
    
    reset=ECS.handNull;

    public exec(hName:string):any{
        var h=this[hName];
        if(h!=null){
            return h();
        }
    }
    public on(hName:string,cb):void{
        this[hName]=cb;
    }
}