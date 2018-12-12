/**
 * 数字，字符串都标识同一数据的包装体 
 */
export class _dd{
    /** [readonly] 数值**/
    public n:number;
    /** [readonly] 字符串**/
    public s:string;
    /** [readonly] 数据**/
    public d:any;

    public constructor(_n,_s){
        this.n=_n;
        this.s=_s;
        this.d=this;
    }
}