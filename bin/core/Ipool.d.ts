import { Inodelist } from "./Inodelist";
import { i_base } from "./i_base";
export declare class Ipool {
    /** [readonly] 产生的类需要实现i_base接口**/
    classType: any;
    /** [readonly] 对象池所含数据*/
    pool: Inodelist;
    /** 对象池最大容量*/
    max: number;
    /** 池子名称*/
    name: String;
    init(name: string, max: number, classType: any): void;
    /**
     * 清空数据
     */
    clear(): void;
    private _destroy;
    private _creat;
    /**
    * 填充数据
    * @param n 池子补满充到该数量。以池子容量为最大数量限制。
    */
    fill(n: number): void;
    /**
     * 放置一个元素到池子中里。如果该元素还存在其他链表中，则会从其他链表中移除。
     * @param o 实现i_base接口的对象
     * @return 返回是否成功放置该数据对象。
     */
    free(o: i_base): boolean;
    /** 获取一个对象*/
    malloc(): any;
}
