import { tableinfo } from "./tableinfo";
export declare class query {
    _sql(cb: any, connection: any, sql: any, args: any): void;
    /** 把数据d更新到数据库 */
    _update(cb: any, connection: any, d: any): void;
    /** 把数据d从数据库删除 */
    _delete(cb: any, connection: any, d: any): void;
    /** 把数据d插入数据库 */
    _insert(cb: any, connection: any, d: any): void;
    /***
     * 查询sql语句。unsafe 。调用前确保sql是安全的
     * @param table 查询后的数据归属的表是哪个表
     */
    _select(cb: any, connection: any, sql: any, args: any, table: tableinfo): void;
    /** 在table表中查询主键id的数据 */
    _find(cb: any, connection: any, id: any, table: tableinfo): void;
    /*** 高级查找*/
    _findMax(cb: any, connection: any, table: tableinfo, cond: any, orderby: any, maxCount: any): void;
}
