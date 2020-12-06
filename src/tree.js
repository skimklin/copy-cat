import C from './Coact/Coact'

class TreeNode extends C {
  render() {
    const { content, renderFn } = this.props

    return C.createElement(
      'ul',
      null,
      C.createElement('li', null, renderFn ? renderFn(content) : renderFn)
    )
  }
}

export default class Tree extends C {
  render() {
    const { data = [], renderFn } = this.props

    const renderTree = nodeData => {
      if (Array.isArray(nodeData.children)) {
        return C.createElement(
          TreeNode,
          {
            content: nodeData.content,
            renderFn
          },
          nodeData.children.map(renderTree)
        )
      }
      return C.createElement(TreeNode, {
        content: nodeData.content,
        renderFn
      })
    }

    return C.createElement(
      'div',
      {
        class: 'tree'
      },
      data.map(renderTree)
    )
  }
}
