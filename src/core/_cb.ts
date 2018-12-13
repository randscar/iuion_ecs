/** 
 * 方法回调封装体 
 */
export class _cb{
    /** 方法里的this对象 */
    thisobj:any;
    /** 方法 */
    f:Function;
    /** 方法使用的参数 */
    args:any[];
    /** [private] 标识状态的数据，0为未使用，1为使用 */
    __=0;

    public static _pools:any[]=[];
    /**
     * 根据方法获取一个方法包装对象
     */
    static get(f:Function,thisobj:any,args:any[]):_cb{
        var arr=_cb._pools;
        var h:_cb;
        if(arr.length>0){
            h=arr[arr.length-1];
            arr.pop();
        }else{
            h=new _cb();
        }
        h.thisobj=thisobj;
        h.f=f;
        h.args=args;
        h.__=1;
        return h;
    }
    /** 释放对应的方法封装体  */
    static free(h:_cb):boolean{
        if(h.__==1){
            h.__=0;
            h.args=null;
            h.f=null;
            h.thisobj=null;
            _cb._pools.push(h);
            return true;
        }
        return false;
    }
    /** 执行方法（验证方法的状态） */
    static run(h:_cb):any{
        if(h.__==0)return null;
        return h.f.apply(h.thisobj,h.args);
    }
    /** 执行方法（不验证方法的状态） */
    static run_(h:_cb):any{
        return h.f.apply(h.thisobj,h.args);
    }
    /** 执行方法并丢回对象池.(会验证方法体的状态) */
    static run2free(h:_cb):any{
        if(h.__==0)return null;
        var r=h.f.apply(h.thisobj,h.args);
        h.__=0;
        h.args=null;
        h.f=null;
        h.thisobj=null;
        _cb._pools.push(h);
        return r;
    }
}