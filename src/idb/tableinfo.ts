export class tableinfo{
    /** 表名 */
    public tableName: String;
    /** key主键字段名*/
    public keyName;
    /** 数据库里需要操作的字段信息*/
    public field_db: any[];
    public fieldNames:string[];
    public fieldComments:string[];
    public select: string;//select
    public insert: string;//insert
    public update: string;//update
    public delete: string;//delete
    /**
     * 
     * @param pool 
     * @param table 
     * @param fieldsInfo 
     * {
     * Collation:"utf8_general_ci",
     * Comment:"说明信息",
     * Field:"fieldName",
     * Key:"PRI",
     * Null:"NO",
     * Type:"int(11)"
     * Default:"1970-01-01 00:00:00"
     * }
     */
    setInfo(pool,table,fieldsInfo) {
        var a=[];
        var b=[];
        for(var i=0;i<fieldsInfo.length;i++){
            a[i]=fieldsInfo[i].Field;
            b[i]=fieldsInfo[i].Comment;
        }
        var key=fieldsInfo[0].Field;
        var s=this;
        s.keyName=key;
        s.fieldNames=a;
        s.fieldComments=b;
        s.field_db=fieldsInfo;
        s.tableName=table;
        //select * from admin where username='abc’ or 1=1 and password='123’ sql注入式攻击
        s.select="select * from " + table + " where " + key + "=";
        s.delete="delete from "+table+" where "+key+"=";
        var t=a[1]+"=?";
        //INSERT INTO t1(field1,field2) VALUES(v101,v102),(v201,v202),(v301,v302),(v401,v402);//可插入批量数据
        //INSERT INTO tableName set field=?,filed=?;//可插入批量数据
        for(var i=2;i<a.length;i++){
            t=t+","+a[i]+"=?";
        }
        s.insert="insert into " + table +" set "+ t;
        //update users set password=?,f1=?,f2=? where name="zhangsan"
        s.update= "update " + table + " set "+t+" where " + key + "=";//
    }

    getid(d:any){
        return d[this.keyName];
    }
    setid(d:any,v){
        d[this.keyName]=v;
    }
    p_insert(d:any):any[]{
        return this.p_update(d);
        // var a=this.fieldNames;
        // var r=[0];
        // for(var i=a.length-1;i>0;i--){
        //     r[i]=d[a[i]];
        // }
        // return r;
    }
    p_update(d:any):any[]{
        var a=this.fieldNames;
        var r=[];
        for(var i=a.length-1;i>0;i--){
            r[i-1]=d[a[i]];
        }
        return r;
    }
    /**
     * 注意orderby的传入格式
     * @param cond 
     * @param orderby ASC：升序（默认），DESC：降序。 fieldName asc fieldName2 desc
     * @param maxCount 
     */
    s_select(cond,orderby,maxCount):string{
        var r="select * from " + this.tableName;
        if(cond){
            r=r+ " where ";
            for(var i=0;i<cond.length;i++){
                if(i>0){
                    r=r+" and ";
                }
                var o=cond[i];
                r=r+"("+o[0]+" "+o[1]+" ?)";
            }
        } 
        
        if(orderby){
            r=r+" order by "+orderby;
        }
        if(maxCount&&maxCount>0){
            r=r+" limit "+maxCount;
        }
        return r;
    }
    a_select(cond):any[]{
        var a=[];
        if(cond){
            for(var i=0;i<cond.length;i++){
                a[i]=cond[i][2];
            }
        }
        return a;
    }
}
