export function setDomProps(dom, nodeProps = {}) {
  const { children, ...props } = nodeProps
  for (const [attribute, value] of Object.entries(props)) {
    if (attribute.startsWith('on')) {
      dom[attribute] = value
    } else {
      dom.setAttribute(attribute, value)
    }
  }
}
// 创建真实的dom节点
function createDom(Vnode) {
  let dom
  const { type, key, props, ceactInstance } = Vnode
  if (typeof type === 'string') {
    const { children, ...nodeProps } = props
    dom = document.createElement(type)
    setDomProps(dom, nodeProps)
  } else if (typeof type === 'function') {
    const Component = type
    const ins = new Component(props)
    const Vnodes = ins.render()
    dom = createDomTree(Vnodes)
    bindInstanceRoot(ins, dom)

    // set vnodes attributes
    Vnodes.ceactInstance = ins
    ins.vnodes = Vnodes

    // console.log('instance => ', ins)
    // console.log('Vnodes => ', Vnodes)
    // console.log('dom => ', dom)
  }

  return dom
}

// 给根节点绑定实例
// 给实例绑定根节点
export function bindInstanceRoot(instance, root) {
  instance.root = root
  root.ceactInstance = instance
}

export function createDomTree(node) {
  if (typeof node === 'string') return document.createTextNode(node)

  const { props } = node
  const dom = createDom(node)
  if (props.children) {
    const children = Array.isArray(props.children)
      ? props.children.map(createDomTree)
      : [createDomTree(props.children)]

    children.forEach(element => {
      dom.appendChild(element)
    })
  }

  return dom
}

// 创建虚拟Vnode
function createReactElement(type, key, props, children) {
  const element = {
    type: type,
    root: null,
    key: key,
    ref: null,
    vnodes: null,
    props: {
      ...props,
      children: children
    },
    ceactInstance: null
  }

  return element
}

export default function createElement(
  typeOrConstructor = {},
  propOptions = {},
  children
) {
  const { key, ...props } = propOptions || {}

  return createReactElement(typeOrConstructor, key, props, children)
}
