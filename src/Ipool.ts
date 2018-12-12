import { Inode } from "./Inode";
import { Inodelist } from "./Inodelist";
import { i_base } from "./i_base";


export class Ipool{
    /** [readonly] 产生的类需要实现i_base接口**/
    public classType:any;
    /** [readonly] 对象池所含数据*/
    public pool:Inodelist=new Inodelist();
    /** 对象池最大容量*/
    public max:number=0;
    /** 池子名称*/
    public name:String;
    public init(name:string,max:number,classType:any):void{
        var s:Ipool=this;
        s.name=name;
        s.max=max;
        s.classType=classType;
    }
    /**
     * 清空数据
     */        
    public clear():void{
        this.pool.clear(this._destroy);
    }
    private _destroy(n:Inode):void{
        var d=n.udata;
        if(d!=null){
            d.reset();
        }
    }
    private _creat():Inode{
        var ni:Inode=new Inode();
        var d:i_base=new this.classType();
        d._pool=ni;
        ni.udata=d;
        return ni;
    }
    /** 
    * 填充数据
    * @param n 池子补满充到该数量。以池子容量为最大数量限制。
    */
    public fill(n:number):void{
        var s:Ipool=this;
        if(s.max>0&&n>s.max)n=s.max;
        for(var i=s.pool.size;i<n;i++){
            s.pool.push(s._creat());
        }
    }
    /** 
     * 放置一个元素到池子中里。如果该元素还存在其他链表中，则会从其他链表中移除。
     * @param o 实现i_base接口的对象
     * @return 返回是否成功放置该数据对象。
     */
    public free(o:i_base):boolean{
        var s:Ipool=this;
        var n:Inode=o._pool;
        if(n.list==s.pool)return false;
        o.reset();
        if (s.max==0||s.pool.size < s.max){
            return s.pool.push(n);
        }
        return false;
    }
    /** 获取一个对象*/
    public malloc():any{
        var s:Ipool=this;
        var r:Inode = s.pool.pop();
        if (r == null){
            r=s._creat();
        }
        return r.udata;
    }
}