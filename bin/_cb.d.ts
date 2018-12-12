/**
 * 方法回调封装体
 */
export declare class _cb {
    /** 方法里的this对象 */
    thisobj: any;
    /** 方法 */
    f: Function;
    /** 方法使用的参数 */
    args: any[];
    /** [private] 标识状态的数据，0为未使用，1为使用 */
    __: number;
    static _pools: any[];
    /**
     * 根据方法获取一个方法包装对象
     */
    static get(f: Function, thisobj: any, args: any[]): _cb;
    /** 释放对应的方法封装体  */
    static free(h: _cb): boolean;
    /** 执行方法（验证方法的状态） */
    static run(h: _cb): any;
    /** 执行方法（不验证方法的状态） */
    static run_(h: _cb): any;
    /** 执行方法并丢回对象池.(会验证方法体的状态) */
    static run2free(h: _cb): any;
}
