/**
 * 可以压缩一组id数组。（适用于无序列要求的数组列表）
 */
export class uintc{
    /** 必须是32的整数倍 可以是0 */
    public key:number;
    public value:number;
    public init(id:number){
        this.value=0;
        this.add(id);
    }
    public add(id:number):Boolean{
        var s=this;
        var r=(id/32)>>0;
        r=r*32;
        var g:Boolean=(s.key!=r);
        if(g){
            s.key=r;
            s.value=0;
        }
        r=id-s.key;
        s.value=(1<<r)|s.value;
        return g;
    }
    private static uc:uintc=new uintc();
    /** (数据解压)把单条数据解析成id列表，存储在idsave里 key必须是32的倍数(kv)是一个连续的key,value数组 */
    public static decode(kv:any[],ids:any[]):void{
        for(var j=0;j<kv.length;j+=2){
            var k=kv[j];
            var v=kv[j+1];
            for(var i=0;i<32;i++){
                if(((v>>i)&1)==1){
                    ids.push(i+k);
                }
            }            
        }
    }
    /** (数据压缩)把一组id编码成idsave列表 */
    public static compress_uint(ids:any[],save:any[]):void{
        if(ids.length==0)return;
        ids.sort();
        var uc:uintc=uintc.uc;
        uc.init(ids[0]);
        save.push(uc.key);
        save.push(uc.value);
        for(var i=0;i<ids.length;i++){
            if(uc.add(ids[i])){
                save.push(uc.key);
                save.push(uc.value);
            }else{
                save[save.length-1]=uc.value;
            }
        }
    }
     /** (数据添加)向已有的kv数组里添加一个新的id(高效) */
     public static compress_uint_add(kv:any[],id:number):void{
        var uc:uintc=uintc.uc;
        uc.init(id);
        var i=kv.indexOf(uc.key)+1;
        if(i>0){
            uc.value=kv[i];
            uc.add(id);
            kv[i]=uc.value;
        }else{
            kv.push(uc.key);
            kv.push(uc.value);
        }
    }
}