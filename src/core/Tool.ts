
/** 工具类 */
export class Tool{
    /***
     * 替换字符串中全部指定的内容
     * @param v 原始字符串
     * @param f 要被替换的字符串 如"<br>"
     * @param r 要替换的字符串 如"\n"
     * @return 返回一个新的字符串。
     */
    public static str_replaceAll(v:string, f:string, r:string):string{
        var i:number = v.indexOf(f);
        if (i < 0) return v;
        var rs:string = "";
        var tp:number = 0;
        var rl:number = f.length;
        for (; i >= 0; ){
            rs = rs + v.substring(tp, i) + r;
            tp = i + rl;
            i = v.indexOf(f, tp);
        }
        rs = rs + v.substring(tp);
        return rs;
    }
    /***
     * 字符串数据补充。str_add("1",3,"0",true)则会返回字符串"001"。
     * @param v 原始字符串
     * @param addstr 补充的内容
     * @param before 补充在原始字符串前还是字符串后
     * @return 返回一个新的字符串。
     */
    public static str_add(v:string, size:number, addstr:string, before:boolean):string{
        var i:number = v.length;
        if (i >= size) return v;
        var n:number = addstr.length;
        if (before){
            for (; i < size; i += n){
                v = addstr + v;
            }
        }
        else{
            for (; i < size; i += n){
                v = v + addstr;
            }
        }
        return v;
    }
    /**
     * 格式化字符串。
     * @param s
     * @param args
     * @param argi
     * @return 
     */		
    public static str_format(s:string,args:any[],argi:number):string{
        var size:number = args.length;
        for (; argi < size; argi++){
            s = Tool.str_replaceAll(s,"{" + argi + "}", args[argi]);
        }
        return s;
    }
    public static str_format2(s:string,...args):string{
        return Tool.str_format(s,args,0);
    }
    
    /**
     * 数组数据随机排列。
     * @param o
     */
    public static shuf(o:any[]):void{
        var len:number=o.length;
        for(var i:number=len-1;i>=0;i--){
            var s:any=o[i];
            var j:number=Math.floor(Math.random()*len);//index=index>>0取整
            o[i]=o[j];
            o[j]=s;
        }
    }
    /**
     * 数组浅复制。
     * @param arr 数据源
     * @param res 结果数组
     * @return 
     */		
    public static copy(arr:any[],res:any[]):any[]{
        res.length=0;
        for(var i:number=arr.length-1;i>=0;i--){
            res[i]=arr[i];
        }
        return res;
    }

    /***
     * 返回格式化的时间yyyy-MM-dd HH:mm:ss.SSS (2017-09-28 15:00:36.138)
     */
    public static date_day(d:Date,p:string):string{
        var r:string = d.getFullYear()+p;
        var m:number = d.getMonth() + 1;
        var n:number = d.getDate();
        if(m<10)r=r+"0"+m;
        else r=r+m;
        r=r+p;
        if(n<10)r=r+"0"+n;
        else r=r+n;
        return r;
    }
    /** 获取Date的时间字符串00:00:00.000 */
    public static date_time(d:Date):string{
        var r:string="";
        var h:number = d.getHours();
        var i:number = d.getMinutes();
        var j:number= d.getSeconds();
        var k:number = d.getMilliseconds();
        if(h<10)r=r+"0"+h;
        else r=r+h;
        r=r+":";
        if(i<10)r=r+"0"+i;
        else r=r+i;
        r=r+":";
        if(j<10)r=r+"0"+j;
        else r=r+j;
        r=r+".";
        if(k<10)r=r+"00"+k;
        else if(k<100)r=r+"0"+k;
        else r=r+k;
        return r;
    }
    /**  */
    public static size_1024b(n, fix) {
        if (n < 1024)
            return n + "B";
        var v = 1024;
        if (n < v * 1024)
            return (n / v).toFixed(fix) + "KB";
        v = v * 1024;
        if (n < v * 1024)
            return (n / v).toFixed(fix) + "MB";
        v = v * 1024;
        if (n < v * 1024)
            return (n / v).toFixed(fix) + "GB";
        v = v * 1024;
        return (n / v).toFixed(fix) + "TB";
    }
}