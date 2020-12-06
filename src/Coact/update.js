import { LIFECYCLES, callLifeCycle } from './lifecycle'
import compareVNode, { PATCH_TYPE } from './compare'
import { createDomTree, setDomProps } from './createElement'

export function update(instance, nextProps, nextStates, doUpdateStateOrProp) {
  const shouldUpdate = callLifeCycle(
    LIFECYCLES.shouldComponentUpdate,
    instance,
    nextProps,
    nextStates,
    instance
  )
  if (shouldUpdate === false) return

  doUpdateStateOrProp()
}

function genUpdater(instance) {
  const nextVNodes = instance.render()
  const updateQueue = compareVNode(instance.vnodes, nextVNodes)
  const updater = patchDifference(instance.root, updateQueue, nextVNodes)

  // console.log(updateQueue)
  return updater
}

export function setState(instance, payload) {
  const nextStates = {
    ...instance.state,
    ...payload
  }
  const setState = () => {
    instance.state = nextStates
    const updater = genUpdater(instance)
    instance.update(updater)
  }
  update(instance, instance.props, nextStates, setState)
}
export function setProps(instance, payload) {
  // callLifeCycle(LIFECYCLES.componentWillReceiveProps, instance, payload)
  const nextProps = {
    ...instance.props,
    ...payload
  }
  const setProps = () => {
    instance.props = nextProps
    const updater = genUpdater(instance)
    instance.update(updater)
  }
  update(instance, nextProps, instance.state, setProps)
}

function getChild(el) {
  return el.childNodes
}

function getParent(el) {
  return el.parentNode
}

function getNextDom(el) {
  return el.nextElementSibling
}

export function patchDifference(root, updateQueue, nextVNodes) {
  const rootNode = getParent(root)
  if (!rootNode) return

  const updater = instance => {
    updateQueue.forEach(element => {
      const { path, type, vnode } = element
      const domElement = path.reduce((prev, key) => {
        try {
          prev = getChild(prev)[key]
          return prev
        } catch (error) {
          return null
        }
      }, rootNode)
      if (!domElement) return new Error('没查到原始dom')
      const nextDom = getNextDom(domElement)
      const parentNode = getParent(domElement)
      const domNode = createDomTree(vnode)

      switch (type) {
        case PATCH_TYPE.UPDATE: {
          setDomProps(domElement, domNode)
          break
        }
        case PATCH_TYPE.ADD: {
          parentNode.appendChild(domNode)
          break
        }
        case PATCH_TYPE.DELETE: {
          parentNode.removeChild(domElement)
          break
        }
        case PATCH_TYPE.REPLACE: {
          parentNode.removeChild(domElement)
          if (nextDom) {
            parentNode.insertBefore(domNode, nextDom)
          } else {
            parentNode.appendChild(domNode)
          }
          break
        }
      }
    })
    if (instance) {
      instance.vnodes = nextVNodes
    }
  }
  return updater
}
