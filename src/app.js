import C from './Coact/Coact'
import Tree from './tree'

const renderFn = text =>
  C.createElement('div', null, [
    C.createElement(
      'span',
      {
        style: 'margin-right: 8px'
      },
      text
    ),
    C.createElement('button', null, '删除'),
    C.createElement('button', null, '新增')
  ])

export default class App extends C {
  constructor() {
    super()

    this.state = {
      msg: 1,
      data: [
        {
          content: 'parent-1',
          children: [
            {
              content: 'child-1'
            },
            {
              content: 'child-2',
              children: [
                {
                  content: 'child-2-1'
                },
                {
                  content: 'child-2-2'
                }
              ]
            },
            {
              content: 'child-3',
              children: [
                {
                  content: 'child-3-1',
                  children: [
                    {
                      content: 'child-3-1-1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.msg >= 10) {
      alert('别尼玛点了！')
      return false
    }
  }

  setCount(msg) {
    this.setState({
      msg: msg + 1
    })
  }

  render() {
    const { msg } = this.state
    // console.log(this, 'this')

    return C.createElement(
      'div',
      {
        class: 'abc'
      },
      [
        C.createElement(Tree, {
          data: this.state.data,
          renderFn
        }),
        C.createElement(
          'h3',
          {
            style: 'color: orange'
          },
          '哎哟 '
        ),
        C.createElement(
          'h4',
          {
            style: 'color: skyblue'
          },
          '不错！'
        ),
        C.createElement(
          'h2',
          {
            style: 'color: #aaa;cursor: pointer;',
            // onclick: () => {
            //   this.setState({
            //     msg: msg + 1
            //   })
            // }
            onclick: () => this.setCount(this.state.msg)
          },
          `点击了${msg}次`
        )
      ]
    )
  }
}
