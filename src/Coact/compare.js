export const PATCH_TYPE = {
  ADD: 'add',
  UPDATE: 'update',
  REPLACE: 'replace',
  DELETE: 'delete'
}

function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function getChild(VNode) {
  return (VNode.props && VNode.props.children) || []
}

function isSameVNode(VNode, VNode2) {
  if (!isObject(VNode) || !isObject(VNode2)) {
    return typeof VNode === typeof VNode2
  }
  return (
    typeof VNode === typeof VNode2 &&
    VNode.type === VNode2.type &&
    VNode.key === VNode.key
  )
}

function shouldVNodeUpdate(VNode, VNode2) {
  if (!isObject(VNode) || !isObject(VNode2)) {
    return VNode !== VNode2
  }
  const { children, ...props } = VNode.props
  const { children: children2, ...props2 } = VNode2.props

  return (
    Object.keys(props).length !== Object.keys(props2).length ||
    !Object.keys(props).every(key => {
      return props[key] === props2[key]
    })
  )
}

/**
 * 对比元素,返回需要更新的队列
 * @param {*} oldChildren 旧的自元素
 * @param {*} newChildren 新的自元素
 * @param {*} path 遍历树的路径
 */
function compare(oldNode, newNode, path = []) {
  const oldChildren = Array.isArray(oldNode)
    ? oldNode
    : isObject(oldNode)
    ? [oldNode]
    : oldNode
  const newChildren = Array.isArray(newNode)
    ? newNode
    : isObject(newNode)
    ? [newNode]
    : newNode
  if (!Array.isArray(oldChildren)) {
    return newNode === oldNode
      ? []
      : [
          {
            path: path.concat([0]),
            type: PATCH_TYPE.REPLACE,
            vnode: newNode
          }
        ]
  }

  const updateQueue = []
  const length =
    oldChildren.length > newChildren.length
      ? oldChildren.length
      : newChildren.length

  for (let index = 0; index < length; index++) {
    const oldVNode = oldChildren[index]
    const newVNode = newChildren[index]
    if (isSameVNode(oldVNode, newVNode)) {
      if (shouldVNodeUpdate(oldVNode, newVNode)) {
        updateQueue.push({
          path: path.concat([index]),
          type: PATCH_TYPE.UPDATE,
          vnode: newVNode
        })
      }
      const oldVNodeCh = getChild(oldVNode)
      const newVNodeCh = getChild(newVNode)
      updateQueue.push(...compare(oldVNodeCh, newVNodeCh, path.concat([index])))
    } else {
      const type =
        oldVNode && newVNode
          ? PATCH_TYPE.REPLACE
          : oldVNode
          ? PATCH_TYPE.DELETE
          : PATCH_TYPE.ADD
      updateQueue.push({
        path: path.concat([index]),
        type: type,
        vnode: newVNode
      })
    }
  }
  return updateQueue
}

/**
 * 比较新旧Vnodes，返回需要更新的VNodes
 * @param {vnodes} oldVNodes
 * @param {vnodes} newVNodes
 * @returns {updateQueue} updateQueue
 */
export default function compareVNode(oldVNodes, newVNodes) {
  // console.log('input vnodes => ', oldVNodes, newVNodes)
  return compare(oldVNodes, newVNodes)
}
