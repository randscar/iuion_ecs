import { tableinfo } from "./tableinfo";
import { query } from "./query";
/**
 * mysql 数据库连接池
 * 核心功能。查询立即处理，其他的按队列处理。
 * 注意：所有依赖id查询的必须是数值,否则会被注入。依据名称等其他条件的使用db.findMax()
 * sql表必须第一个字段是主键
 */
export declare class db {
    /** select处理列表 */
    private _0;
    /** 处理列表 */
    private _1;
    /** 数据库连接池 */
    pool: any;
    /** 数据库链接对象 */
    conn: any;
    /** 按表名存储的tableinfo集合 */
    private tables;
    /** 转义字符 */
    escape: any;
    /** 数据库名称 */
    name: any;
    /** 查询模块 */
    q: query;
    /**
     * 关闭所有连接，清除所有数据
     */
    destroy(): void;
    /** 获取待处理的数据记录 */
    size(): number;
    /** 连接指定的数据库(dbkey不能有重名的) */
    connect(cb: (err: any) => void, conf: any, findMaxCount: any, log?: Function): void;
    private _add;
    /** 查找数据 */
    find(cb: (err: any, res: any[]) => void, tableName: string, id: any): void;
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
    findMax(cb: (err: any, result: any) => void, tableName: string, cond: any[][], orderby?: any, maxCount?: number): void;
    /** 更新数据 */
    update(cb: (err: any, result: any) => void, d: any): boolean;
    /** 插入数据 */
    insert(cb: (err: any, result: any) => void, d: any): boolean;
    /** 删除数据 */
    delete(cb: (err: any, result: any) => void, d: any): boolean;
    /*** 根据id直接删除数据 */
    deleteId(cb: (err: any, result: any) => void, id: any, tableName: any): void;
    /** 直接执行sql语句(调用时需要防注入) */
    sql(cb: (err: any, result: any) => void, sql: any, args: any): void;
    /** 获取链接 */
    getConnection(cb: (err: any, connection: any) => void): any;
    /** 获取表信息*/
    table(tableName: any): tableinfo;
    /** 创建新的数据记录 */
    newRow(tableName: any, o: any): any;
    /** 数据下所有表的对象 */
    allTables(): any;
    private _check;
}
