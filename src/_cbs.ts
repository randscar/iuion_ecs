import { _cb } from "./_cb";

 
 /** 
  * 方法处理类 
  * 
  */
 export class _cbs{
    private _s:_cb[]=[];
    private _l:number=0;
    /**
     * 添加方法。检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return 
     */		
    public add(f:Function,thisobj:any,args:any[]):boolean{
        if(this.get(f,thisobj)==null){
            var h=_cb.get(thisobj,f,args);
            this._s.push(h);
            return true;
        }
        return false;
    }
    /**
     * 添加方法。不检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return 
     */	
    public add_(f:Function,thisobj:any,args:any[]):void{
        var h=_cb.get(thisobj,f,args);
        this._s.push(h);
    }
    /**
     * 获取包含指定的thisobj与方法的 方法体
     * @param f
     * @param thisobj 
     * @return 
     */		
    public get(f:Function,thisobj:any):_cb{
        var s=this._s;
        for(var i=s.length-1;i>=0;i--){
            var r=s[i];
            if(r.f==f&&r.thisobj==thisobj){
                return r;
            }
        }
        return r;
    }
    /**
     * 处理所有添加的方法。(在处理的方法中添加的会在下一帧才处理)
     */
    public callLater():void{
        var s=this._s;
        var max:number=s.length;
        if(max>0){
            this._l=max;
            for(var i:number=0;i<max;i++){
                _cb.run2free(s[i]);
            }
            s.splice(0,max);
            this._l=0;
        }
    }
    /** 执行第一个方法 */
    public cbFrame():any{
        var s=this._s;
        var max:number=s.length;
        var r=null;
        if(max>0){
            r=_cb.run2free(s[0]);
            s.splice(0,1);
        }
        return r;
    }
    /**
     * 清空所有数据
     */		
    public reset():void{
        var s=this._s;
        for(var i=s.length-1;i>=0;i--){
            _cb.free(s[i]);
        }
        s.length=0;
    }
    /**
     * 获取要执行的方法长度
     * @return 
     */		
    public size():number{
        return this._s.length;
    }
}