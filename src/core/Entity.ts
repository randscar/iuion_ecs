import { ECS } from "./ECS";
import { Inode } from "./Inode";
import { _cbs } from "./_cbs";
import { Ievent } from "./Ievent";
import { EventID } from "./EventID";

/** 实体类 */
export class Entity extends Ievent{
    /** 实体id */
    public instid:any;
    /** 实体名称 */
    public name:string;
    /** [readonly] 实体组件id(根据comid存储的组件键值对。用数值是为了提供性能) */
    public coms:any=[];

    /** 由对象池使用。 */
    public _pool:Inode;
    /** 延迟处理的数据对象列表 */
    private _later:_cbs=new _cbs();

    private _enabled:boolean=true;
    /** 延迟一帧的处理 */
    public callLater(f:Function,thisobj:any,args:any[]):void{
        var l=this._later;
        if(!l.get(f,thisobj)){
            l.add(thisobj,f,args);
            ECS.callLater(l.callLater,l);
        }
    }
    /** @Override */
    public reset():void{
        this.callComs("reset");
        this._later.reset();
        super.reset();
    }

    public setScript(id:number,script:any):void{
        this.coms[id]=script;
    }
    public callComs(cbName:string):void{
        this.coms.forEach((element:any) => {
            var h=element[cbName];
            if(h!=null)h();
        });
    }
    /** 改变 激活/禁用 状态。 */
    public setEnabled(v:boolean):void{
        if(this._enabled!=v){
            this._enabled=v;
            this.sendEventD(EventID.enabled_change,v,this);
        }
    }
}