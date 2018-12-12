/** 缓动类方法 */
export class Transition{
	/**
	 * 线性移动。（等同匀速移动）
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */		
	public static linear_none(t:number,c:number,b:number):number{
		return c*t+b;
	}
	
	/**
	 * 平方缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quad_in(t:number,c:number,b:number):number{
		return c*t*t+b;
	}
	/**
	 * 平方缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quad_out(t:number,c:number,b:number):number{
		return c *t*(2-t)+b;
	}
	/**
	 * 平方缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quad_both(t:number,c:number,b:number):number{
		if(t<0.5) return c*2*t*t+b;
		return c*(2*t*(2-t)-1)+b;
	}
	/**
	 * 立方缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */		
	public static cubic_in(t:number,c:number,b:number):number{
		return c*t*t*t+b;
	}
	/**
	 * 立方缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static cubic_out(t:number,c:number,b:number):number{
		t--;
		return c*(t*t*t+1)+b;
	}
	/**
	 * 立方缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static cubic_both(t:number,c:number,b:number):number{
		if(t<0.5) return c*4*t*t*t+b;
		t--;
		return c*(4*t*t*t+1)+b;
	}
	/**
	 * 四次方缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quart_in(t:number,c:number,b:number):number{
		return c*t*t*t*t+b;
	}
	/**
	 * 四次方缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quart_out(t:number,c:number,b:number):number{
		t--;
		return c*(1-t*t*t*t)+b;
	}
	/**
	 * 四次方缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quart_both(t:number,c:number,b:number):number{
		if(t<0.5) return c*8*t*t*t*t+b;
		t--;
		return c*(1-8*t*t*t*t)+b;
	}
	/**
	 * 五次方缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */	
	public static quint_in(t:number,c:number,b:number):number{
		return c*t*t*t*t*t+b;
	}
	/**
	 * 五次方缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static quint_out(t:number,c:number,b:number):number{
		t--;
		return c*(t*t*t*t*t+1)+b;
	}
	/**
	 * 五次方缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static quint_both(t:number,c:number,b:number):number{
		if(t<0.5) return c*16*t*t*t*t*t+b;
		t--;
		return c*(16*t*t*t*t*t+1)+b;
	}
	private static _pi2:number=Math.PI*0.5;	
	private static _2pi:number=Math.PI*2;	
	/**
	 * 正弦缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static sine_in(t:number,c:number,b:number):number{
		return c-c*Math.cos(t*Transition._pi2)+b;
	}
	/**
	 * 正弦缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static sine_out(t:number,c:number,b:number):number{
		return c*Math.sin(t*Transition._pi2)+b;
	}
	/**
	 * 正弦缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static sine_both(t:number,c:number,b:number):number{
		return c*0.5*(1-Math.cos(Math.PI*t))+b;
	}
	/**
	 * 指数缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static expo_in(t:number,c:number,b:number):number{
		if(t==0)return b;
		return c*Math.pow(2, 10*(t-1))+b;
	}
	/**
	 * 指数缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static expo_out(t:number,c:number,b:number):number{
		if(t==1)return c+b;
		return c*(1-Math.pow(2, -10*t))+b;
	}
	/**
	 * 指数缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static expo_both(t:number,c:number,b:number):number{
		if(t==0) return b;
		if(t==1) return c+b;
		if(t<0.5)return c*0.5*Math.pow(2, 20*t-10)+b;
		return c*0.5*(2-Math.pow(2, 10-20 *t))+b;
	}
	/**
	 * Circular 迂回缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static circ_in(t:number,c:number,b:number):number{
		return c*(1-Math.sqrt(1-t*t))+b;
	}
	/**
	 * Circular 迂回缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static circ_out(t:number,c:number,b:number):number{
		return c*Math.sqrt((2-t)*t)+b;
	}
	/**
	 * Circular 迂回缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static circ_both(t:number,c:number,b:number):number{
		if(t<0.5)return c*0.5*(1-Math.sqrt(1-4*t*t))+b;
		t=t*2-2;
		return c*0.5*(Math.sqrt(1-t*t)+1)+b;
	}
	/**
	 * 弹回缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static elastic_in(t:number,c:number,b:number):number{
		if(t==0)return b;
		if(t==1)return c+b;
		return -c*Math.pow(2,10*t-10)*Math.sin((3.33*t-3.58)*Transition._2pi)+b;
	}
	/**
	 * 弹回缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static elastic_out(t:number,c:number,b:number):number{
		if(t==0)return b;
		if(t==1)return c+b;
		return c*(Math.pow(2,-10*t)*Math.sin((3.33*t-0.25)*Transition._2pi)+1)+b;
	}
	/**
	 * 弹回缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static elastic_both(t:number,c:number,b:number):number{
		if(t==0)return b;
		if(t==1)return c+b;
		if(t<0.5)return -c*0.5*Math.pow(2,20*t-10)*Math.sin((4.45*t-2.475)*Transition._2pi)+b;
		return c*(Math.pow(2, 10-20*t)*Math.sin((4.45*t-2.475)*Transition._2pi)*0.5+1)+b;  
	}
	/**
	 * 后退缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static back_in(t:number,c:number,b:number):number{
		return c*t*t*(2.70158*t-1.70158)+b;
	}
	/**
	 * 后退缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static back_out(t:number,c:number,b:number):number{
		t--;
		return c*(t*t*(2.70158*t+1.70158)+1)+b;
	}
	/**
	 * 后退缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static back_both(t:number,c:number,b:number):number{
		if(t<0.5)return c*t*t*(14.379636*t-5.189818)+b;
		t--;
		return c*(t*t*(14.379636*t+5.189818)+1)+b;  
	}
	/**
	 * 弹性缓入
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static bounce_in(t:number,c:number,b:number):number{
		if(t>0.636364){  
			t=1-t;  
			return c*(1-7.5625*t*t)+b;  
		}  
		if(t>0.27273){  
			t=0.454546-t;  
			return c*(0.25-7.5625*t*t)+b;  
		}  
		if(t>0.090909){  
			t=0.181818-t;  
			return c*(0.0625-7.5625*t*t)+b;  
		}
		t=0.045455-t;
		return c*(0.015625-7.5625*t*t)+b;
	}
	/**
	 * 弹性缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static bounce_out(t:number,c:number,b:number):number{
		if(t<0.363636)return c*7.5625*t*t+b; 
		if(t<0.72727){  
			t=t-0.545454;  
			return c*(7.5625*t*t+0.75)+b;  
		}  
		if(t<0.909091){  
			t-=0.818182;  
			return c*(7.5625*t*t+0.9375)+b;  
		}
		t=t-0.954545;  
		return c*(7.5625*t*t+0.984375)+b;
	}	
	/**
	 * 弹性缓入缓出
	 * @param t 归一化时间（0-1）
	 * @param c 增量值
	 * @param b 起始值
	 * @return 
	 */
	public static bounce_both(t:number,c:number,b:number):number{
		if(t<0.045455){
			t=0.045455-t*2;  
			return c*(0.007813-3.78125*t*t)+b;  
		}
		if(t<0.136365){
			t=0.181818-t*2;  
			return c*(0.03125-3.78125*t*t)+b;  
		}
		if(t<0.318182){
			t=0.454546-t*2;  
			return c*(0.125-3.78125*t*t)+b;  
		}
		if(t<0.5){
			t=1-t*2;  
			return c*(0.5-3.78125*t*t)+b;  
		}
		// bounce out  
		if(t<0.681818){  
			t=t*2-1;  
			return c*(3.78125*t*t+0.5)+b;  
		}  
		else if(t<0.863635){  
			t=t*2.0-1.545454;  
			return c*(3.78125*t*t+0.875)+b;  
		}  
		else if(t<0.954546){  
			t=t*2-1.818182;  
			return c*(3.78125*t*t+0.96875)+b;  
		}  
		t=t*2-1.954545;  
		return c*(3.78125*t*t+0.992188)+b;
	}
	/**
	 * 贝塞尔二次曲线
	 * @param t 时间0-1
	 * @param c 控制值
	 * @param b 起始值 
	 * @param d 目标值
	 * @return 
	 */		
	public static q_bezier(t:number,c:number,b:number,d:number):number{
		return (1-t)*(1-t)*b+2*t*(1-t)*c+t*t*d;
	}
}