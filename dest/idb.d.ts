declare module "dbutil" {
    import { tableinfo } from "tableinfo";
    export class dbutil {
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
}
declare module "tableinfo" {
    export class tableinfo {
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
}
declare module "query" {
    import { tableinfo } from "tableinfo";
    export class query {
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
}
declare module "dbqueue" {
    export class dbqueue {
        count: number;
        private _a;
        private _0;
        /**  添加方法 */
        add(f: (q_cb: any) => void): void;
        private _endcb;
        private _next;
        size(): number;
    }
}
declare module "db" {
    import { tableinfo } from "tableinfo";
    import { query } from "query";
    /**
     * mysql 数据库连接池
     * 核心功能。查询立即处理，其他的按队列处理。
     * 注意：所有依赖id查询的必须是数值,否则会被注入。依据名称等其他条件的使用db.findMax()
     * sql表必须第一个字段是主键
     */
    export class db {
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
}
