import createElement, { bindInstanceRoot, createDomTree } from './createElement'
import { setState, setProps, patchDifference } from './update'
import { LIFECYCLES, callLifeCycle } from './lifecycle'

export default class Coact {
  constructor(props = {}, state = {}) {
    this.props = props
    this.state = state
  }
  setState(payload, callback) {
    setState(this, payload)
  }
  setProps(props) {
    setProps(this, props)
  }

  // 更新当前组件
  update(updater) {
    Promise.resolve().then(() => updater(this))
  }

  static createElement(...args) {
    return createElement(...args)
  }

  mount(rootDomElement) {
    const Vnodes = this.render()
    const dom = createDomTree(Vnodes)
    bindInstanceRoot(this, dom)

    if (rootDomElement) {
      const parentNode = rootDomElement.parentNode
      parentNode.removeChild(rootDomElement)
      parentNode.appendChild(dom)
    }
    callLifeCycle(this, LIFECYCLES.componentDidMount)
    return dom
  }
}

export class CoactDom {
  static Render(genVnodes, rootDomElement) {
    const Vnodes = genVnodes()
    const domNodes = createDomTree(Vnodes)

    rootDomElement.appendChild(domNodes)
  }
}
