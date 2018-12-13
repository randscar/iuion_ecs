import {tableinfo} from "./tableinfo";
import {dbutil} from "./dbutil";
import {query} from "./query";
import {dbqueue} from "./dbqueue";

var mysql=require('mysql');
/**
 * mysql 数据库连接池
 * 核心功能。查询立即处理，其他的按队列处理。
 * 注意：所有依赖id查询的必须是数值,否则会被注入。依据名称等其他条件的使用db.findMax()
 * sql表必须第一个字段是主键
 */
export class db {
    /** select处理列表 */
    private _0:dbqueue=new dbqueue();
     /** 处理列表 */
     private _1:dbqueue=new dbqueue();
    /** 数据库连接池 */
    public pool;
    /** 数据库链接对象 */
    public conn;
    /** 按表名存储的tableinfo集合 */
    private tables:any={};
    /** 转义字符 */
    public escape=mysql.escape;
    /** 数据库名称 */
    public name;
    /** 查询模块 */
    public q:query=new query();

    /**
     * 关闭所有连接，清除所有数据
     */
    destroy() {
        var s=this;
        s.pool.end();
    }
    /** 获取待处理的数据记录 */
    size(){
        return this._0.size()+this._1.size();
    }
    /** 连接指定的数据库(dbkey不能有重名的) */
    connect(cb:(err)=>void,conf,findMaxCount,log:Function=null) {
        var s:db=this;
        if(s.name!=null){
            cb("It has already connect!");
            return;
        }
        if(typeof conf!="object")
        {
            conf={
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '',
                database: conf, // 与库名一致
                charset: "UTF8_GENERAL_CI"
            };
        }
        var st=Date.now();
        var dbname=conf.database;
        var pool=mysql.createPoolCluster();
        pool.add(dbname,conf);
        s.pool=pool;
        s.conn=pool.of(dbname);
        s.name=dbname;

        var a=[null,null,"show tables"];
        s._add(s._0,s,s.q._sql,a,function(err,result){
            if(err){
                cb(err);
            }else{
                var field="Tables_in_"+dbname;
                var t=result.length;
                var i=0;

                result.forEach(ele => {
                    var tname=ele[field];
                    var table=new tableinfo();
                    s.tables[tname]=table;
                    var a2=[null,null,"show full columns from "+tname];
                    i++;
                    //if(log)log("add "+i+" "+tname);
                    s._add(s._0,s,s.q._sql,a2,function(e1,r1){
                        t--;
                        if(!dbutil.isKeyPRI(r1[0])){
                            log(tname+" keypri is not "+r1[0].field);
                        }
                        table.setInfo(s,tname,r1);
                        if(log)log("read table : "+table.tableName);
                        if(t==0){
                            cb(null);
                        }
                    });
                });
            }
        });
    }
    private _add(a:dbqueue,s:db,f:Function,args:any[],cb:(err,result)=>void){
        a.add(function(qcb){
            s.getConnection(function(err,connection){
                if(err){
                    if(cb)cb(err,null);
                    qcb();
                }else{
                    args[0] = function(err,result){
                        connection.release();
                        if(cb)cb(err,result);
                        qcb();
                    };
                    args[1] = connection;
                    f.apply(null, args);
                }
            });
        })
    }
    /** 查找数据 */
    find(cb:(err,res:any[])=>void,tableName:string,id):void {
        var s:db=this;
        var t:tableinfo=s._check(cb,id,tableName,s);
        if(t!=null){
            s._add(s._0,s,s.q._find.bind(s.q),[null,null,id,t],cb);
        }
    }
    /*** 
     * 复杂查找
     * cond
     * 
     * cond 条件格式 二维数组
     * [
     * ["id","<","1000"],
     * ["vlevel",">",1000"]
     * ]
     */
    findMax(cb:(err,result)=>void,tableName:string,cond:any[][],orderby=null,maxCount=0):void{
        var s=this;
        var t:tableinfo=s.tables[tableName];
        if(t==null){
            cb(s.name+" has no table with name="+tableName,null);
            return;
        }
        s._add(s._0,s,s.q._findMax.bind(s.q),[null,null,t,cond,orderby,maxCount],cb);
    }
    

    /** 更新数据 */
    update(cb:(err,result)=>void,d):boolean{
        if(d.__1==dbutil.SELECT){
            var s=this;
            d.__1=dbutil.UPDATE;
            s._add(s._1,s,s.q._update.bind(s.q),[null,null,d],cb);
            return true;
        }
        return false;
    }
    /** 插入数据 */
    insert(cb:(err,result)=>void,d):boolean{
        if(d.__1==dbutil.INIT){
            d.__1=dbutil.INSERT;
            var s=this;
            s._add(s._1,s,s.q._insert.bind(s.q),[null,null,d],cb);
            return true;
        }
        return false;
    }
    /** 删除数据 */
    delete(cb:(err,result)=>void,d):boolean{
        var _1=d.__1;
        if(_1==dbutil.INIT)return false;
        if(_1==dbutil.INSERT){
            d.__1=dbutil.INIT;
        }else if(_1!=dbutil.DELETE){
            var s=this;
            d.__1=dbutil.DELETE;
            s._add(s._1,s,s.q._delete.bind(s.q),[null,null,d],cb);
            return true;
        }
        return false;
    }
    /*** 根据id直接删除数据 */
    deleteId(cb:(err,result)=>void,id,tableName){
        var s:db=this;
        var t:tableinfo=s._check(cb,id,tableName,s);
        if(t==null)return;
        s._add(s._1,s,s.q._sql.bind(s.q),[null,null,t.delete+id,null],cb);
    }
    /** 直接执行sql语句(调用时需要防注入) */
    sql(cb:(err,result)=>void,sql,args){
        var s=this;
        s._add(s._0,s,s.q._sql.bind(s.q),[null,null,sql,args],cb);
    }
    /** 获取链接 */
    getConnection(cb:(err,connection)=>void){
        return this.conn.getConnection(cb);
    }
    /** 获取表信息*/
    table(tableName):tableinfo{
        return this.tables[tableName];
    }
    /** 创建新的数据记录 */
    newRow(tableName,o):any{
        var t:tableinfo=this.tables[tableName];
        if(t!=null){
            dbutil.newRow(t,o);
        }
        return o;
    }
    /** 数据下所有表的对象 */
    allTables(){
        return this.tables;
    }

    private _check(cb:(err,result)=>void,id,tableName,s:db):tableinfo{
        if(isNaN(id)){
            cb("id must be number "+id,null);
            return null;
        }
        var t=s.tables[tableName];
        if(t==null){
            cb("DB:"+s.name+" do not have a table="+tableName,null);
            return null;
        }
        return t;
    }
}