/** 缓动类方法 */
export declare class Transition {
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
