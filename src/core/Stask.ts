import { Inodelist } from "./Inodelist";
import { Inode } from "./Inode";
import { Spool } from "./Spool";
import { Itask } from "./Itask";
import { ECS } from "./ECS";
import { _cb } from "./_cb";

/** 时间处理对象 */
export class Stask{
    ///** 任务列表*/
    //private _task:Inodelist=new Inodelist();
    /** 处理任务剩余等待的时间*/
    private _waitTime:number = 0;
    private _task:Inodelist=new Inodelist();
    private _needSort=false;
    /**
     * 前系统运行的核心处理功能
     * @param deltaTime 距离上一帧的时间
     * @param timeScale 使用的时间缩放
     * @param cb 调试处理方法，Sys调用使用Sys.doprofile
     * @param callbackProfile 调试处理外部回调方法,参数(time,func,funcArgs)同Sys.callbackProfile
     * @see Sys.callbackProfile
     */		
    public _update(time:number,deltaTime:number):void{
        var s=this;
        if(s._waitTime>0){
            s._waitTime=s._waitTime-deltaTime;
            return;
        }
        this._onexec(s._task,time);
        if(s._task.size==0){
            //ECS.log.info(ECS.lang.tr(1001));
        }
    }
    private dosort(t:Inodelist):void{
        var exec:Inode=t.start;
        var next:Inode;
        var nexttask:Itask;
        var max:number=t.size;
        var pool:Spool=ECS.pool;
    }
    private _onexec(t:Inodelist,time:number):void{
        if(this._needSort==true){
            this._needSort=false;
        }
        var exec:Inode=t.start;
        var next:Inode;
        var nexttask:Itask;
        var max:number=t.size;
        var pool:Spool=ECS.pool;
        var tc:number=0;
        var cb=_cb.run_;
        for(var i:number=0;i<max;i++){
            var nc:Itask=exec.udata;
            next=exec.next;
            if(nc.status==2){
                if(time>=nc._nextExecTime){
                    nc._nextExecTime=nc._nextExecTime+nc.period;
                    tc=nc.restCount;
                    if(tc==-1){
                        cb(nc.cb);
                    }else{
                        if(tc>0){
                            tc=tc-1;
                            nc.restCount=tc;
                            if(tc==0){
                                nc.status=3;
                                cb(nc.cb);
                                //nc.cb.apply(null,nc.cbargs);
                                if(nc.complete!=null){
                                    cb(nc.complete);
                                }
                            }else{
                                cb(nc.cb);
                            }
                        }
                    }
                }
            }else{
                if(nc.autoDestroy){
                    pool._remTaskByNode(nc._pool);
                }else{
                    t.remove(exec);
                }
            }
            exec=next;
            if(exec==null||this._waitTime>0){
                return;
            }
        }
    }
    
    /** 获取当前任务中心是否正在运行。**/
    public running():boolean{
        return this._waitTime < 1;
    }
    /** 
     * 当前帧处理结束后休眠指定时间后自动恢复执行。
     * @param time 小于1则标识立即恢复执行。若要暂停，time=Number.MAX_VALUE即可。
     */
    public sleep(time:number):void{
        this._waitTime = time;
    }
    
    /** 添加任务对象**/
    public extask(task:Itask,delay:number):boolean{
        this._needSort=true;
        task._nextExecTime=ECS.time.time+delay;
        return this._task.push(task._pool);
    }
    /** 对任务排序 */
    public sort():void{
        this._needSort=true;
    }

    /** 清空全部任务数据**/
    public clear():void{
        var pool:Spool=ECS.pool;
        this._task.clear(pool._remTaskByNode.bind(pool));
    }
    /** 待执行任务长度 */
    public size():number{
        return this._task.size;
    }
}