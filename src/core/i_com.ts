import { Entity } from "./Entity";
import { i_base } from "./i_base";
/** 组件接口 */
export interface i_com extends i_base{
    /** [readonly] 所属实体（如果存在） */
    ent:Entity;
    
    /** 更新 */
    onupdate():void;

}