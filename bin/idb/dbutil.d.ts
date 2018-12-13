import { tableinfo } from "./tableinfo";
export declare class dbutil {
    static INIT: number;
    static INSERT: number;
    static SELECT: number;
    static UPDATE: number;
    static DELETE: number;
    /** 是否是主键 */
    static isKeyPRI(field: any): any;
    /** 获取数据id */
    static getid(d: any): number;
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
    static getDefault(field: any): any;
    static hasData(d: any): boolean;
    /** new一条指定表的数据(只有通过该方法增加的数据才能insert插入数据库) */
    static newRow(t: tableinfo, o: any): any;
    /** 设置数据的状态与表信息 state 为dbutil的常量（INIT，INSERT...）*/
    static setRow(d: any, state: any, t: tableinfo): any;
    /** 复制数据 */
    static cloneRow(d: any): any;
    /** 复制数据为普通的obj对象 */
    static cloneRow2obj(d: any): {};
    /** 把一个对象转换为指定表里的数据 */
    static result2Row(d: any, t: tableinfo): any;
    /** 按json格式返回数据库查询数据的内容 */
    static stringify(d: any, c?: number): string;
}
