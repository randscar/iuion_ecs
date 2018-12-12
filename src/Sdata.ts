import { Entity } from "./Entity";
import { Ilog } from "./Ilog";
import { ECS } from "./ECS";


/*** 全部数据管理类 （每条数据需要继承Entity来实现） */
export class Sdata{
    
    private _d:Object={};

    private _disableId:number[]=[];
    /** 添加数据管理 */
    public add(id:number,d:Entity):void{
        d.instid=id;
        var old=this._d[id];
        if(old!=null){
            console.error(this+" has save data by id:"+id+"="+old);
        }
        this._d[id]=old;
    }
    /** 根据id获取管理类 */
    public get(id:number):Entity{
        return this._d[id];
    }
}