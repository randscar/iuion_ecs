/**
 * 语法版本数据存储
 */
export class _lang{
    /** [readonly] 全部语言的数据存储**/
    private _strs:Object=new Object();
    /** [readonly] 当前语言名称。通过setLang设置数据 */
    public langName:string;
    /** [readonly] 当前使用的语言数据**/
    private _obj:Object;
    /** 设置当前翻译的语言名称*/
    public setLang(name:string):boolean{
        var s=this;
        if(s.langName!=name){
            var d:any=s._strs[name];
            if(d!=null){
                s._obj=d;
                s.langName=name;
                return true;
            }
        }
        return false;
    }
    /** 根据语言名称获取数据 */
    public get(langName:string):any{
        return this._strs[langName];
    }
     /** 添加/覆盖更改 语言数据 */
     public add(langName:string,d:Object):void{
        this._strs[langName]=d;
    }
    private _i:string[]=["{0}","{1}","{2}","{3}","{4}","{5}"];
    /**
     * 全局多语言翻译函数
     * @param code 要查询的字符串代码
     * @param args 替换字符串中{0}标志的参数列表
     * @returns 返回拼接后的字符串
     */
     public tr(code:number, ...args):any{
         var s=this;
         var text=s._obj[code];
        if(!text){
            return code;
        }
        var length = args.length;
        for(var i=0;i<length;i++){
            text = text.replace(s._i[i], args[i]);
        }
        return text;
    }
}