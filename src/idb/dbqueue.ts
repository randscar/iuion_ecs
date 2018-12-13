export class dbqueue{
    public count=1;
    private _a:any[]=[];
    private _0=0;
    /**  添加方法 */
    add(f:(q_cb)=>void){
        var s=this;
        var a=s._a;
        a[a.length]=f;
        s._next();
    }
    private _endcb(){
        var s=this;
        var a=s._a;
        var b=s._0;
        if(a.length>0){
            a.splice(0,1);
            s._0=b-1;
            s._next();
        }else{
            console.error("it must no happed!");
        }
    }
    private _next(){
        var s=this;
        var a=s._a;
        var b=s._0;
        if(a.length>0&&b<s.count){
            s._0=b+1;
            a[b](s._endcb.bind(s));
        }
    }
    size(){return this._a.length;}
}