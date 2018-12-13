declare module "_cb" {
    /**
     * 方法回调封装体
     */
    export class _cb {
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
}
declare module "_cbs" {
    import { _cb } from "_cb";
    /**
     * 方法处理类
     *
     */
    export class _cbs {
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
}
declare module "_dd" {
    /**
     * 数字，字符串都标识同一数据的包装体
     */
    export class _dd {
        /** [readonly] 数值**/
        n: number;
        /** [readonly] 字符串**/
        s: string;
        /** [readonly] 数据**/
        d: any;
        constructor(_n: any, _s: any);
    }
}
declare module "_lang" {
    /**
     * 语法版本数据存储
     */
    export class _lang {
        /** [readonly] 全部语言的数据存储**/
        private _strs;
        /** [readonly] 当前语言名称。通过setLang设置数据 */
        langName: string;
        /** [readonly] 当前使用的语言数据**/
        private _obj;
        /** 设置当前翻译的语言名称*/
        setLang(name: string): boolean;
        /** 根据语言名称获取数据 */
        get(langName: string): any;
        /** 添加/覆盖更改 语言数据 */
        add(langName: string, d: Object): void;
        private _i;
        /**
         * 全局多语言翻译函数
         * @param code 要查询的字符串代码
         * @param args 替换字符串中{0}标志的参数列表
         * @returns 返回拼接后的字符串
         */
        tr(code: number, ...args: any[]): any;
    }
}
declare module "_mem" {
    /**
     * 用来存储程序充常用的数据
     */
    export class _mem {
        static lang_zh: {
            1001: string;
        };
        static lang_en: {
            1001: string;
        };
    }
}
declare module "_time" {
    /**
     * 时间数据管理器。所有时间相关 参数以毫秒为单位。
     */
    export class _time {
        /** [readonly] 当前fps(约每0.5秒计算一次)*/
        fps: number;
        /** [readonly] 总帧数*/
        frameCount: number;
        /** [readonly] 开始时间*/
        startTime: number;
        /** [readonly] 从游戏开始到到现在所用的时间（只读,受缩放影响）。 */
        time: number;
        /** [readonly] 自游戏开始的真实时间（只读,不受缩放影响）。 */
        realtime: number;
        /** [readonly] 完成最后一帧消耗的时间*/
        deltaTime: number;
        /** [readonly] 上一次执行的时间点 */
        private _last;
        /** 时间缩放 */
        scale: number;
        private _f;
        private _t;
        /**
         * 每帧处理函数,传入时间为毫秒数.
         * @param now
         * @returns 返回真实时间差。
         */
        frame(now: number): number;
        /** 启动逻辑*/
        start(now: number): void;
    }
}
declare module "Inodelist" {
    import { Inode } from "Inode";
    /***
     * 管理Inode集合的列表对象。
     */
    export class Inodelist {
        /** [readonly] 链表长度*/
        size: number;
        /** [readonly] 第一个元素*/
        start: Inode;
        /** [readonly] 最后一个元素**/
        end: Inode;
        /**
         * 把当前列表的元素全部移动到新的列表末尾。
         * 注意：由于元素同一时间只能存在一个链表中，因此此方法处理结束后，当前列表元素将被清空。
         * @param d 目标链表
         */
        moveTo(d: Inodelist): void;
        /** 清除所有元素并对元素作处理**/
        clear(cb: any): void;
        /**
         * 把指定元素插入到当前列表的首位
         * @param n
         * @return
         */
        unshift(n: Inode): boolean;
        /**
        * 添加一个节点在列表的末尾处。<p></p>
        * 注意：如果元素已经存在其他链表中，则会从其他列表中移除。如果已经在该链表中，则不作处理
        * @param d 要添加的列表
        * @param n 要操作的元素
        * @return 如果为当前列表末尾元素则返回false，否则会先从原来列表中移除（包含自身）添加到当前列表，返回true。
        */
        push(n: Inode): boolean;
        push_(d: Inodelist, n: Inode): void;
        /**
        * 删除一个节点。
        * @param n
        * @return 必须存储在当前链表中才能成功删除。成功删除返回true，否则返回false。
        */
        remove(n: Inode): boolean;
        /**
        * 获取指定元素在列表中的索引。
        * @param n
        * @return 如果不存在列表中则返回-1。
        */
        getIndex(n: Inode): number;
        /**
        * 获取指定索引处的元素
        * @param index
        * @return
        */
        getAt(index: number): Inode;
        /** 删除列表最后一个元素。**/
        pop(): Inode;
        /** 删除列表第一个元素**/
        shift(): any;
        /**
        * 将指定节点插入到指定节点的位置。
        * @param n 要插入的元素。该元素必须不存在与任何Cnodelist列表中才能插入。
        * @param e 用来定位的元素。该元素必须存在于当前Cnodelist列表中才能插入元素n。
        * @return 成功添加才返回true，否则返回false。其他规则同add()。
        */
        insert(n: Inode, e: Inode): boolean;
    }
}
declare module "Inode" {
    import { Inodelist } from "Inodelist";
    /** 链表基类。可与Cnodelist搭配使用 */
    export class Inode {
        /** [readonly] 下一个节点**/
        next: Inode;
        /** [readonly] 上一个节点*/
        prev: Inode;
        /** [readonly] 当前所在的链表。可用以判断是否被链表所拥有。**/
        list: Inodelist;
        /** 自定义数据1。默认为null*/
        udata: any;
        /** 从链表中移除，并执行数据的h方法,传null则不执行 */
        remove(): void;
    }
}
declare module "Ievent" {
    import { _dd } from "_dd";
    /** 事件类 */
    export class Ievent {
        private _stop;
        private _evts;
        private _evtid;
        /** 发送事件时的目标对象 */
        target: any;
        /**
         * 添加事件监听
         * @param {number} evtid 事件id
         * @param {Function} cb 回调方法。包含参数cb(evtid,data,this);
         */
        addEvent(evtid: number, cb: Function): void;
        /**
         * 删除事件监听
         * @param {number} evtid 事件id
         * @param {Function} cb 回调方法。该值为null时则清空该类型所有事件回调。
         */
        remEvent(evtid: number, cb: Function): boolean;
        /** 获取指定事件类型的回调列表 */
        getEvent(evtid: any): any[];
        /**
         * 发出指定类型的事件
         * @param evtid 事件类型
         * @param data 事件数据
         * @param target 发送此事件的目标
         * **/
        sendEvent(evtid: number, data: any, target: any): void;
        sendEventD(d: _dd, data: any, target: any): void;
        /** 处理事件时停止当前侦听事件的后续执行。**/
        stop(): void;
        /** 清空所有事件 */
        reset(): void;
    }
}
declare module "EventID" {
    import { _dd } from "_dd";
    export class EventID {
        /** enabled属性发生改变 */
        static enabled_change: _dd;
        /** 初始化 */
        static init: number;
        /** 更新 */
        static update: number;
        /** 销毁（如果有对象池则管理，则用以回收到对象池） */
        static destroy: number;
        /** 添加事件 */
        static add: number;
        /** 删除事件 */
        static remove: number;
        /** 改变 */
        static change: number;
        /** 重新调整 */
        static resize: number;
    }
}
declare module "Entity" {
    import { Inode } from "Inode";
    import { Ievent } from "Ievent";
    /** 实体类 */
    export class Entity extends Ievent {
        /** 实体id */
        instid: any;
        /** 实体名称 */
        name: string;
        /** [readonly] 实体组件id(根据comid存储的组件键值对。用数值是为了提供性能) */
        coms: any;
        /** 由对象池使用。 */
        _pool: Inode;
        /** 延迟处理的数据对象列表 */
        private _later;
        private _enabled;
        /** 延迟一帧的处理 */
        callLater(f: Function, thisobj: any, args: any[]): void;
        /** @Override */
        reset(): void;
        setScript(id: number, script: any): void;
        callComs(cbName: string): void;
        /** 改变 激活/禁用 状态。 */
        setEnabled(v: boolean): void;
    }
}
declare module "i_base" {
    import { Inode } from "Inode";
    /** 组件接口 */
    export interface i_base {
        /** [readonly] node作为对象池存在时，用来快速存取的标识对象 */
        _pool: Inode;
        /** 重置（可销毁也可用于放置于对象池） */
        reset(): void;
        /** 开始使用（从对象池取出时的回调） */
        onuse(): void;
    }
}
declare module "Ipool" {
    import { Inodelist } from "Inodelist";
    import { i_base } from "i_base";
    export class Ipool {
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
}
declare module "Itask" {
    import { Inode } from "Inode";
    import { _cb } from "_cb";
    /** 任务数据类(必须与Stask结合使用) */
    export class Itask {
        /** 初始化状态 */
        static INIT: number;
        /** 释放状态*/
        static REM: number;
        /** 工作状态*/
        static WORK: number;
        /** 取消工作状态*/
        static CANCEL: number;
        /** [readonly] 使用的node对象（对象池专用） */
        _pool: Inode;
        /** [readonly] 方法对象*/
        cb: _cb;
        /** [readonly]（作任务对象使用时）下一次处理的时间**/
        _nextExecTime: number;
        /** [readonly] （作任务对象使用时）固定的延迟时间，默认值为0。*/
        period: number;
        /** 任务剩余执行次数。默认值为-1,标识每帧都会执行。大于0为剩余可执行的次数。**/
        restCount: number;
        /** 任务执行完成的回调方法*/
        complete: _cb;
        /**  [readonly] 当前状态，初始与空闲状态：0，赋予任务1，计划执行2,取消执行3 （可与常量比较，外部仅获取）*/
        status: number;
        /** 是否自动释放该对象。默认值为true,即在停止该任务执行时自动回收到对象池。*/
        autoDestroy: boolean;
        /** 销毁所有(如果要确保放入对象池则使用Spool.remTask) */
        reset(): void;
        /**
         * 让当前正在进行的任务睡眠指定的时间。以毫秒为单位
         * @param time 睡眠的时间
         */
        sleep(time: number): void;
        /** 设置任务数据 */
        setcb(cb: _cb): void;
        /** 设置任务完成数据，必须有任务数据才可以设置完成数据 */
        setComplete(complete: _cb): boolean;
        /**
         * 停止任务的执行。
         */
        stop(): void;
        /**
         * 开始处理任务。
         * 注意：任务对象不可添加到其他的Ilist列表中，否则会导致任务功能失效。
         * @param delay 第一次任务处理的延迟，毫秒单位。
         * @param restart 是否重新启动。
         * @return 已经作为任务处理则返回false。
         */
        start(delay: number, restart: boolean): boolean;
    }
}
declare module "i_com" {
    import { Entity } from "Entity";
    import { i_base } from "i_base";
    /** 组件接口 */
    export interface i_com extends i_base {
        /** [readonly] 所属实体（如果存在） */
        ent: Entity;
        /** 更新 */
        onupdate(): void;
    }
}
declare module "Spool" {
    import { Ipool } from "Ipool";
    import { Inode } from "Inode";
    import { Entity } from "Entity";
    import { Itask } from "Itask";
    import { i_com } from "i_com";
    /**
     * 全部Comp对象池的管理
     * 1.组件id必须是通过getComId生成
     * 2.提供实体与组件的创建、销毁逻辑
     *
    */
    export class Spool {
        /** [readonly] 组件id**/
        com_id: number;
        /** [readonly] 依据id存储的组件对象池列表**/
        com_pool: Ipool[];
        /**
         * 初始化一个对象池，并依据组件id存储在对应的id列表中。（该方法不作任何逻辑检测.）
         * @param comid 组件id列表
         * @param name 对象池名称
         * @param classType 对象池使用类
         * @param max 对象池容量上限。为0时表示无上限。
         * @return 返回生成的对象池。
         * */
        addPoolComp(comid: number[], name: string, classType: any, max: number): Ipool;
        /** 生成实体的组件自增id */
        makePoolCompId(): number;
        /** [readonly] 任务数据对象池**/
        private _task;
        /** [private] 获取一个任务对象 */
        _getTask(f: Function, thisobj: any, args: any[]): Itask;
        /** 释放一个任务对象并放入对象池。 */
        remTask(t: Itask): boolean;
        /** [private] 删除一个任务对象(不作检测会立即释放到对象池里。) */
        _remTaskByNode(n: Inode): void;
        getTaskPoolSize(): number;
        private _ent;
        /** Entity对象池回收。（非Comp模式数据）*/
        remEntity(n: Entity): boolean;
        /** 获取Entity对象。 （非Comp模式数据）*/
        newEntity(): Entity;
        private _instid;
        /** 添加组件模块 */
        addComp(comid: number, n: Entity): i_com;
        /** 删除组件模块 */
        remComp(comid: number, n: Entity): boolean;
    }
}
declare module "Ilog" {
    export class Ilog {
        static NO: number;
        /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
        static ERROR: number;
        /** 常量。警告级别*/
        static WARN: number;
        /** 常量。信息说明级别*/
        static INFO: number;
        /** 常量。调试级别*/
        static DEBUG: number;
        type: Object;
        level: number;
        /** 外部监听日志处理函数必须包含参数(level:String, o:Object)*/
        log: (nlevel: number, o: any[]) => void;
        /** 信息说明**/
        debug(...args: any[]): void;
        /** 信息说明**/
        info(...args: any[]): void;
        /** 警告**/
        warn(...args: any[]): void;
        /** 错误**/
        error(...args: any[]): void;
    }
}
declare module "Stask" {
    import { Itask } from "Itask";
    /** 时间处理对象 */
    export class Stask {
        /** 处理任务剩余等待的时间*/
        private _waitTime;
        private _task;
        private _needSort;
        /**
         * 前系统运行的核心处理功能
         * @param deltaTime 距离上一帧的时间
         * @param timeScale 使用的时间缩放
         * @param cb 调试处理方法，Sys调用使用Sys.doprofile
         * @param callbackProfile 调试处理外部回调方法,参数(time,func,funcArgs)同Sys.callbackProfile
         * @see Sys.callbackProfile
         */
        _update(time: number, deltaTime: number): void;
        private dosort;
        private _onexec;
        /** 获取当前任务中心是否正在运行。**/
        running(): boolean;
        /**
         * 当前帧处理结束后休眠指定时间后自动恢复执行。
         * @param time 小于1则标识立即恢复执行。若要暂停，time=Number.MAX_VALUE即可。
         */
        sleep(time: number): void;
        /** 添加任务对象**/
        extask(task: Itask, delay: number): boolean;
        /** 对任务排序 */
        sort(): void;
        /** 清空全部任务数据**/
        clear(): void;
        /** 待执行任务长度 */
        size(): number;
    }
}
declare module "Tool" {
    /** 工具类 */
    export class Tool {
        /***
         * 替换字符串中全部指定的内容
         * @param v 原始字符串
         * @param f 要被替换的字符串 如"<br>"
         * @param r 要替换的字符串 如"\n"
         * @return 返回一个新的字符串。
         */
        static str_replaceAll(v: string, f: string, r: string): string;
        /***
         * 字符串数据补充。str_add("1",3,"0",true)则会返回字符串"001"。
         * @param v 原始字符串
         * @param addstr 补充的内容
         * @param before 补充在原始字符串前还是字符串后
         * @return 返回一个新的字符串。
         */
        static str_add(v: string, size: number, addstr: string, before: boolean): string;
        /**
         * 格式化字符串。
         * @param s
         * @param args
         * @param argi
         * @return
         */
        static str_format(s: string, args: any[], argi: number): string;
        static str_format2(s: string, ...args: any[]): string;
        /**
         * 数组数据随机排列。
         * @param o
         */
        static shuf(o: any[]): void;
        /**
         * 数组浅复制。
         * @param arr 数据源
         * @param res 结果数组
         * @return
         */
        static copy(arr: any[], res: any[]): any[];
        /***
         * 返回格式化的时间yyyy-MM-dd HH:mm:ss.SSS (2017-09-28 15:00:36.138)
         */
        static date_day(d: Date, p: string): string;
        /** 获取Date的时间字符串00:00:00.000 */
        static date_time(d: Date): string;
        /**  */
        static size_1024b(n: any, fix: any): string;
    }
}
declare module "ECS" {
    import { Spool } from "Spool";
    import { Ilog } from "Ilog";
    import { Entity } from "Entity";
    import { Stask } from "Stask";
    import { Itask } from "Itask";
    import { _cbs } from "_cbs";
    import { _lang } from "_lang";
    import { _time } from "_time";
    export class ECS {
        static LOG_NO: number;
        /** 常量。错误级别(运算错误，如外部传值不符合格式而引起的运行错误。)*/
        static LOG_ERROR: number;
        /** 常量。警告级别*/
        static LOG_WARN: number;
        /** 常量。信息说明级别*/
        static LOG_INFO: number;
        /** 常量。调试级别*/
        static LOG_DEBUG: number;
        /** 初始化或待机状态 */
        static STATUS_INIT: number;
        /** 释放状态*/
        static STATUS_RELEASE: number;
        /** 工作状态*/
        static STATUS_WORK: number;
        /** 正在工作状态*/
        static STATUS_ON: number;
        /** 英文 */
        static en_US: string;
        /** 中文 */
        static zh_CN: string;
        /** [readonly] 是否已经启动**/
        static isStart: boolean;
        /*** [readonly]使用日期的格式 20170928 */
        static date: string;
        /*** [readonly]使用时间的格式 00:00:00.000 */
        static datetime: string;
        /** 日志模块 **/
        static log: Ilog;
        /** [readonly] 对象池 */
        static pool: Spool;
        /** [readonly] 获取程序计时器**/
        static time: _time;
        /** [readonly] 任务运行器**/
        static task: Stask;
        /** [readonly] later回调处理运行器**/
        static later: _cbs;
        /** [readonly] 语言模块**/
        static lang: _lang;
        /*** 全局事件对象 */
        static event: Entity;
        /** 当前是否是调试模式 */
        static debug: boolean;
        /** 调试模式下每个方法的执行 */
        static debug_cb: (f: Function, args: any[]) => void;
        static start(ms: number): void;
        /** [private] 更新模块**/
        static _update(): void;
        /**
         * @param delay
         * @param cb
         * @param args
         * @return
         */
        static setTimeOut(cb: Function, thisobj: any, delay: number, ...args: any[]): Itask;
        static setInterval(cb: Function, thisobj: any, period: number, ...args: any[]): Itask;
        static callLater(cb: Function, thisobj: any, ...args: any[]): boolean;
        static handNull: () => void;
    }
}
declare module "Iscript" {
    import { Entity } from "Entity";
    import { Inode } from "Inode";
    /** 组件接口 */
    export class Iscript {
        /** [readonly] node作为对象池存在时，用来快速存取的标识对象 */
        _pool: Inode;
        /** [readonly] 所属实体（如果存在） */
        ent: Entity;
        reset: () => void;
        exec(hName: string): any;
        on(hName: string, cb: any): void;
    }
}
declare module "Sdata" {
    import { Entity } from "Entity";
    /*** 全部数据管理类 （每条数据需要继承Entity来实现） */
    export class Sdata {
        private _d;
        private _disableId;
        /** 添加数据管理 */
        add(id: number, d: Entity): void;
        /** 根据id获取管理类 */
        get(id: number): Entity;
    }
}
declare module "Transition" {
    /** 缓动类方法 */
    export class Transition {
        /**
         * 线性移动。（等同匀速移动）
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static linear_none(t: number, c: number, b: number): number;
        /**
         * 平方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quad_in(t: number, c: number, b: number): number;
        /**
         * 平方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quad_out(t: number, c: number, b: number): number;
        /**
         * 平方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quad_both(t: number, c: number, b: number): number;
        /**
         * 立方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static cubic_in(t: number, c: number, b: number): number;
        /**
         * 立方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static cubic_out(t: number, c: number, b: number): number;
        /**
         * 立方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static cubic_both(t: number, c: number, b: number): number;
        /**
         * 四次方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quart_in(t: number, c: number, b: number): number;
        /**
         * 四次方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quart_out(t: number, c: number, b: number): number;
        /**
         * 四次方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quart_both(t: number, c: number, b: number): number;
        /**
         * 五次方缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quint_in(t: number, c: number, b: number): number;
        /**
         * 五次方缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quint_out(t: number, c: number, b: number): number;
        /**
         * 五次方缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static quint_both(t: number, c: number, b: number): number;
        private static _pi2;
        private static _2pi;
        /**
         * 正弦缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static sine_in(t: number, c: number, b: number): number;
        /**
         * 正弦缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static sine_out(t: number, c: number, b: number): number;
        /**
         * 正弦缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static sine_both(t: number, c: number, b: number): number;
        /**
         * 指数缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static expo_in(t: number, c: number, b: number): number;
        /**
         * 指数缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static expo_out(t: number, c: number, b: number): number;
        /**
         * 指数缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static expo_both(t: number, c: number, b: number): number;
        /**
         * Circular 迂回缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static circ_in(t: number, c: number, b: number): number;
        /**
         * Circular 迂回缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static circ_out(t: number, c: number, b: number): number;
        /**
         * Circular 迂回缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static circ_both(t: number, c: number, b: number): number;
        /**
         * 弹回缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static elastic_in(t: number, c: number, b: number): number;
        /**
         * 弹回缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static elastic_out(t: number, c: number, b: number): number;
        /**
         * 弹回缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static elastic_both(t: number, c: number, b: number): number;
        /**
         * 后退缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static back_in(t: number, c: number, b: number): number;
        /**
         * 后退缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static back_out(t: number, c: number, b: number): number;
        /**
         * 后退缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static back_both(t: number, c: number, b: number): number;
        /**
         * 弹性缓入
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static bounce_in(t: number, c: number, b: number): number;
        /**
         * 弹性缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static bounce_out(t: number, c: number, b: number): number;
        /**
         * 弹性缓入缓出
         * @param t 归一化时间（0-1）
         * @param c 增量值
         * @param b 起始值
         * @return
         */
        static bounce_both(t: number, c: number, b: number): number;
        /**
         * 贝塞尔二次曲线
         * @param t 时间0-1
         * @param c 控制值
         * @param b 起始值
         * @param d 目标值
         * @return
         */
        static q_bezier(t: number, c: number, b: number, d: number): number;
    }
}
declare module "uintc" {
    /**
     * 可以压缩一组id数组。（适用于无序列要求的数组列表）
     */
    export class uintc {
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
}
