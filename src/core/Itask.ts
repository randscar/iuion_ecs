import { ECS } from "./ECS";
import { Inode } from "./Inode";
import { Entity } from "./Entity";
import { _cb } from "./_cb";


/** 任务数据类(必须与Stask结合使用) */
export class Itask{
    /** 初始化状态 */
    public static INIT = 0;
    /** 释放状态*/
    public static REM = 1;
    /** 工作状态*/
    public static WORK = 2;
    /** 取消工作状态*/
    public static CANCEL = 3;


    /** [readonly] 使用的node对象（对象池专用） */
    public _pool:Inode;
    /** [readonly] 方法对象*/
    public cb:_cb;
    /** [readonly]（作任务对象使用时）下一次处理的时间**/
    public _nextExecTime:number=0;
    /** [readonly] （作任务对象使用时）固定的延迟时间，默认值为0。*/
    public period:number=0;
    /** 任务剩余执行次数。默认值为-1,标识每帧都会执行。大于0为剩余可执行的次数。**/
    public restCount:number=-1;
    /** 任务执行完成的回调方法*/
    public complete:_cb;
    /**  [readonly] 当前状态，初始与空闲状态：0，赋予任务1，计划执行2,取消执行3 （可与常量比较，外部仅获取）*/
    public status:number=0;
    /** 是否自动释放该对象。默认值为true,即在停止该任务执行时自动回收到对象池。*/
    public autoDestroy:boolean=true;
    /** 销毁所有(如果要确保放入对象池则使用Spool.remTask) */
    reset():void{
        var s=this;
        if(s.status!=0){
            s.status=0;
            s.period=0;
            s.restCount=-1;
            
            s.autoDestroy=true;
            _cb.free(s.cb);
            s.cb=null;
            if(s.complete!=null){
                _cb.free(s.complete);
                s.complete=null;
            }
        }
    }
    /**
     * 让当前正在进行的任务睡眠指定的时间。以毫秒为单位
     * @param time 睡眠的时间
     */
    public sleep(time:number):void{
        var s=this;
        if(s.status==2){
            ECS.task.extask(s,time);
        }
    }
    /** 设置任务数据 */
    public setcb(cb:_cb):void{
        var ocb=this.cb;
        this.cb=cb;
        if(ocb!=null){
            if(ocb!=cb){
                _cb.free(ocb);
            }
        }
        
        if(cb!=null){
            this.status=1;
        }else{
            this.status=0;
        }
    }
    /** 设置任务完成数据，必须有任务数据才可以设置完成数据 */
    public setComplete(complete:_cb):boolean{
        if(this.status==0)return false;
        var oco=this.complete;
        this.complete=complete;
        if(oco!=null){
            if(oco!=complete){
                _cb.free(oco);
            }
        }
        return true;
    }
    /**
     * 停止任务的执行。
     */
    public stop():void{
        var s=this;
       if(s.status==2){
           s.status=3;
       }
    }
    /**
     * 开始处理任务。
     * 注意：任务对象不可添加到其他的Ilist列表中，否则会导致任务功能失效。
     * @param delay 第一次任务处理的延迟，毫秒单位。
     * @param restart 是否重新启动。
     * @return 已经作为任务处理则返回false。
     */
    public start(delay:number,restart:boolean):boolean{
        var s=this.status;
        if(s==0)return false;
        if(s==1||s==3||(s==2&&restart)){
            this.status=2;
            ECS.task.extask(this,delay);
            return true;
        }
        return false;
    }
}