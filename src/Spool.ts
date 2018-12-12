import { Ipool } from "./Ipool";
import { Inode } from "./Inode";
import { Inodelist } from "./Inodelist";
import { Entity } from "./Entity";
import { Itask } from "./Itask";
import { EventID } from "./EventID";
import { _cb } from "./_cb";
import { i_com } from "./i_com";
/** 
 * 全部Comp对象池的管理 
 * 1.组件id必须是通过getComId生成
 * 2.提供实体与组件的创建、销毁逻辑
 * 
*/
export class Spool{
    /** [readonly] 组件id**/
    public com_id:number=0;
    /** [readonly] 依据id存储的组件对象池列表**/
    public com_pool:Ipool[]=[];
    /** 
     * 初始化一个对象池，并依据组件id存储在对应的id列表中。（该方法不作任何逻辑检测.）
     * @param comid 组件id列表
     * @param name 对象池名称
     * @param classType 对象池使用类
     * @param max 对象池容量上限。为0时表示无上限。
     * @return 返回生成的对象池。
     * */
    public addPoolComp(comid:number[],name:string,classType:any,max:number):Ipool{
        var d=new Ipool();
        d.init(name,max,classType);
        for(var i:number=0;i<comid.length;i++){
            if(this.com_pool[comid[i]]!=null){
                console.error("pool has data with comid : "+comid[i]+"");
            }
            this.com_pool[comid[i]]=d;
        }
        return d;
    }

    /** 生成实体的组件自增id */
    public makePoolCompId():number{
        var i=this.com_id;
        this.com_id=i+1;
        return i;
    }

    ///////////Inode逻辑块/////////////////////
    /** [readonly] 任务数据对象池**/
    private _task:Inodelist=new Inodelist();
    /** [private] 获取一个任务对象 */
    public _getTask(f:Function,thisobj:any,args:any[]):Itask{
        var cb=_cb.get(f,thisobj,args);
        var n:Inode=this._task.pop();
        var t:Itask;
        if(n==null){
            t=new Itask();
            n=new Inode();
            n.udata=t;
            t._pool=n;
        }else{
            t=n.udata;
        }
        t.status=0;
        t.setcb(cb);
        return n.udata;
    }
    /** 释放一个任务对象并放入对象池。 */
    public remTask(t:Itask):boolean{
        t.reset();
        if(t.status!=2){
            this._task.push(t._pool);
            return true;
        }
        return false;
    }
    /** [private] 删除一个任务对象(不作检测会立即释放到对象池里。) */
    public _remTaskByNode(n:Inode):void{
        n.udata.reset();
        this._task.push(n);
    }
    public getTaskPoolSize(){
        return this._task.size;
    }

    ///////////Entity与组件逻辑块/////////////////////
    private _ent:Inodelist=new Inodelist();
    /** Entity对象池回收。（非Comp模式数据）*/
    public remEntity(n:Entity):boolean{
        // var c:i_com[]=n.coms;
        // var pools:Ipool[]=this.com_pool;
        // for(var i=0;i<c.length;i++){
        //     var ci:i_com=c[i];
        //     if(ci!=null){
        //         pools[i].free(ci);
        //         c[i]=null;
        //     }
        // }
        if(n._pool.list!=this._ent){
            n.reset();
            n._pool.remove();
            this._ent.push_(this._ent,n._pool);
            return true;
        }
        return false;
        
    }
    /** 获取Entity对象。 （非Comp模式数据）*/
    public newEntity():Entity{
        var n:Inode=this._ent.pop();
        var e:Entity;
        if(n==null){
            n=new Inode();
            e=new Entity();
            e._pool=n;
            n.udata=e;
            var id:number=this._instid+1;
            this._instid=id;
            e.instid=id;
        }else{
            e=n.udata;
        }
        e.sendEvent(EventID.init,e,Spool);
        return e;
    }
    private _instid:number=0;
    /** 添加组件模块 */
    public addComp(comid:number,n:Entity):i_com{
        var d:i_com=n.coms[comid];
        if(d==null){
            d=this.com_pool[comid].malloc();
            n.coms[comid]=d;
            d.ent=n;
            d.onuse();            
        }
        return d;
    }
    /** 删除组件模块 */
    public remComp(comid:number,n:Entity):boolean{
        var d:i_com=n.coms[comid];
        if(d!=null){
            this.com_pool[comid].free(d);
            d.ent=null;
            n.coms[comid]=null;
            return true;
        }
        return false;
    }
}