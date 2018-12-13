import {tableinfo} from "./tableinfo";

export class dbutil{
    public static INIT=0;
    public static INSERT=1;
    public static SELECT=2;
    public static UPDATE=3;
    public static DELETE=4;
    /** 是否是主键 */
    public static isKeyPRI(field):any{
        return field.Key=="PRI";
    }
    /** 获取数据id */
    public static getid(d:any):number{
        var _0:tableinfo=d.__0;
        return _0.getid(d);
    }
    /**
     * 
     * @param field 
     * {
     * Collation:"utf8_general_ci",
     * Comment:"说明信息",
     * Extra:"auto_increment",
     * Field:"fieldName",
     * Key:"PRI",
     * Null:"NO",
     * Type:"int(11)"
     * Default:"1970-01-01 00:00:00"
     * }
     */
    public static getDefault(field):any{//Comment 说明数据
        var t:string=field.Extra;
        if(t=="auto_increment")return 0;
        t=field.Default;
        if(t!=null)return t;
        t=field.Type;
        if(t.indexOf("int")==0)return 0;
        if(t.indexOf("date")==0)return new Date();
        return null;
    }

    public static hasData(d:any):boolean{
        return d.__1!=dbutil.INIT;
    }


    /** new一条指定表的数据(只有通过该方法增加的数据才能insert插入数据库) */
    public static newRow(t: tableinfo,o): any {
        var s = this;
        o=o||{};
        o.__0=t,
        o.__1=dbutil.INIT;
        var a = t.field_db;
        var n = t.fieldNames;
        for (var i = 0; i < a.length; i++) {
            var k=n[i];
            if(o[k]==null){
                o[k] = dbutil.getDefault(t.field_db[i]);
            }
        }
        return o;
    }
    /** 设置数据的状态与表信息 state 为dbutil的常量（INIT，INSERT...）*/
    public static setRow(d:any,state,t:tableinfo):any{
        d.__0=t;
        d.__1=state;
    }
    /** 复制数据 */
    public static  cloneRow(d: any): any {
        var o = {};
        for (var k in d) {
            o[k] = d[k];
        }
        return o;
    }
     /** 复制数据为普通的obj对象 */
    public static cloneRow2obj(d){
        var o = {};
        for (var k in d) {
            if(k!="__0"&&k!="__1"){
                o[k] = d[k];
            }
        }
        return o;
    }
    /** 把一个对象转换为指定表里的数据 */
    public static result2Row(d: any, t: tableinfo): any {
        d.__0 = t;
        d.__1=dbutil.SELECT;
        return d;
    }
    /** 按json格式返回数据库查询数据的内容 */
    public static stringify(d:any,c=0):string{
        return JSON.stringify(d,d.__0.fieldNames,c);
    }

    
}
