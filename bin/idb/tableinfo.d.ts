export declare class tableinfo {
    /** 表名 */
    tableName: String;
    /** key主键字段名*/
    keyName: any;
    /** 数据库里需要操作的字段信息*/
    field_db: any[];
    fieldNames: string[];
    fieldComments: string[];
    select: string;
    insert: string;
    update: string;
    delete: string;
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
    setInfo(pool: any, table: any, fieldsInfo: any): void;
    getid(d: any): any;
    setid(d: any, v: any): void;
    p_insert(d: any): any[];
    p_update(d: any): any[];
    /**
     * 注意orderby的传入格式
     * @param cond
     * @param orderby ASC：升序（默认），DESC：降序。 fieldName asc fieldName2 desc
     * @param maxCount
     */
    s_select(cond: any, orderby: any, maxCount: any): string;
    a_select(cond: any): any[];
}
