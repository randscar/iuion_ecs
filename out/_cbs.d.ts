import { _cb } from "./_cb";
/**
 * 方法处理类
 *
 */
export declare class _cbs {
    private _s;
    private _l;
    /**
     * 添加方法。检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return
     */
    add(f: Function, thisobj: any, args: any[]): boolean;
    /**
     * 添加方法。不检测是否包含。
     * @param thisobj
     * @param f
     * @param args
     * @return
     */
    add_(f: Function, thisobj: any, args: any[]): void;
    /**
     * 获取包含指定的thisobj与方法的 方法体
     * @param f
     * @param thisobj
     * @return
     */
    get(f: Function, thisobj: any): _cb;
    /**
     * 处理所有添加的方法。(在处理的方法中添加的会在下一帧才处理)
     */
    callLater(): void;
    /** 执行第一个方法 */
    cbFrame(): any;
    /**
     * 清空所有数据
     */
    reset(): void;
    /**
     * 获取要执行的方法长度
     * @return
     */
    size(): number;
}
