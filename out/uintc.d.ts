/**
 * 可以压缩一组id数组。（适用于无序列要求的数组列表）
 */
export declare class uintc {
    /** 必须是32的整数倍 可以是0 */
    key: number;
    value: number;
    init(id: number): void;
    add(id: number): Boolean;
    private static uc;
    /** (数据解压)把单条数据解析成id列表，存储在idsave里 key必须是32的倍数(kv)是一个连续的key,value数组 */
    static decode(kv: any[], ids: any[]): void;
    /** (数据压缩)把一组id编码成idsave列表 */
    static compress_uint(ids: any[], save: any[]): void;
    /** (数据添加)向已有的kv数组里添加一个新的id(高效) */
    static compress_uint_add(kv: any[], id: number): void;
}
