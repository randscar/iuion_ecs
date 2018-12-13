import { i_base } from "./i_base";
import { _dd } from "./_dd";


/** 事件类 */
export class Ievent{
    private _stop:boolean=false;
    private _evts:Object=new Object();
    private _evtid:number[]=[];
    /** 发送事件时的目标对象 */
    public target;
    /** 
     * 添加事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。包含参数cb(evtid,data,this);
     */
    public addEvent(evtid:number,cb:Function):void{
        var s=this;
        var r:any[]=s._evts[evtid];
        if(r==null){
            r=[];
            s._evts[evtid]=r;
            s._evtid.push(evtid);
        }else if(r.indexOf(cb)>=0){
            return;
        }
        r.push(cb);
    }
    /** 
     * 删除事件监听
     * @param {number} evtid 事件id
     * @param {Function} cb 回调方法。该值为null时则清空该类型所有事件回调。
     */
    public remEvent(evtid:number,cb:Function):boolean{
        var r:any[]=this._evts[evtid];
        if(r!=null&&r.length>0){
            if(cb!=null){
                var i:number=r.indexOf(cb);
                if(i>=0){
                    r.splice(i,1);
                    return true;
                }
            }else{
                r.length=0;
                return true;
            }
        }
        return false;
    }
    /** 获取指定事件类型的回调列表 */
    public getEvent(evtid):any[]{
        return this._evts[evtid];
    }
    /** 
     * 发出指定类型的事件
     * @param evtid 事件类型
     * @param data 事件数据
     * @param target 发送此事件的目标
     * **/
    public sendEvent(evtid:number, data,target):void{
        var s:Ievent=this;
        s.target=target;
        var arr:any[]=s._evts[evtid];
        if(arr!=null&&arr.length>0){
            s._stop = false;
            for(var i:number=0;i<arr.length;i++){
                arr[i](evtid,data,s);
                if (s._stop) return;
            }
        }
    }
    public sendEventD(d:_dd,data,target):void{
        this.sendEvent(d.n,data,target);
    }
    /** 处理事件时停止当前侦听事件的后续执行。**/
    public stop():void{
        this._stop = true;
    }
    /** 清空所有事件 */
    public reset():void{
        var arr:number[]=this._evtid;
        if(arr.length>0){
            for(var i=arr.length-1;i>=0;i--){
                this._evts[arr[i]].length=0;
            }
            arr.length=0;
        }
    }
}