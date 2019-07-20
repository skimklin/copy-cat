import { Maybe } from './utils'
import { Component, FunctionComponentType } from './component'

export enum ELEMENT_TYPE {
  HTML_ELEMENT = 1,
  CLASS_COMPONENT = 1 << 1,
  FUNCTION_COMPONENT = 1 << 2,
}

export enum CHILD_TYPE {
  TEXT = 1,
  OBJECT = 1 << 1,
  LIST = 1 << 2,
  NO_CHILDREN = 1 << 3,
}

export type PropType<P extends object = {}> = P &
Partial<HTMLElement> & {
  key?: Maybe<string | number>
}

interface ClassComponent<P extends object = {}, S = any> {
  new (props: P, context?: any): Component<P, S>
}

export interface VNode<P extends object = {}> {
  tag: string | FunctionComponentType | ClassComponent<P>
  elFlag: number
  props: Maybe<Partial<PropType<P>>>
  children: Maybe<VNode | VNode[] | string>
  childFlag: number
}

export function createElement<P extends object = {}>(
  tag: VNode<P>['tag'],
  props: VNode['props'],
  children?: VNode['children']
): VNode | never | null {
  let elFlag = 0
  if (typeof tag === 'string') {
    elFlag = ELEMENT_TYPE.HTML_ELEMENT
  } else if (typeof tag === 'function') {
    elFlag = ELEMENT_TYPE.FUNCTION_COMPONENT
  } else if (tag instanceof Component) {
    elFlag = ELEMENT_TYPE.CLASS_COMPONENT
  } else {
    throw 'invalid tag'
  }

  let childFlag = 0
  if (typeof children === 'string') {
    childFlag = CHILD_TYPE.TEXT
  } else if (children instanceof Array) {
    childFlag = CHILD_TYPE.LIST
  } else if (Object.prototype.toString.call(children) === '[object Object]') {
    childFlag = CHILD_TYPE.OBJECT
  } else {
    childFlag = CHILD_TYPE.NO_CHILDREN
  }

  return {
    tag: tag,
    elFlag,
    props,
    children: children || null,
    childFlag,
  }
}

export const h = createElement
