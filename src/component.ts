import { VNode } from './element'

export interface Component<P extends object = {}, S = {}> {
  props?: P
  context?: any
  state?: Readonly<S>
  componentDidMount?(): void
  componentWillUnMount?(): void
  shouldComponentUpdate?(nextProp: Readonly<P>, nextState: Readonly<S>): void
}

export abstract class Component<P extends object = {}, S = {}> {
  public constructor(props?: P, context?: any) {
    if (props) {
      this.props = props
    }
    this.context = context || {}
  }

  public setState<K extends keyof S>(state: Pick<S, K> | S | null, callback?: () => void): void {
    setState(this, state, callback)
  }

  public update() {
    update(this)
  }

  abstract render(): VNode
}

export interface FunctionComponentType<T extends object = {}> {
  (prop: T): VNode
}

function setState<S>(vm: Component, state: S, callback?: () => void) {}

function update(vm: Component) {}
