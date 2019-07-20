import { h, CHILD_TYPE, ELEMENT_TYPE } from '../src/element'
import { Component, VNode } from '../src'

describe('test createElement', () => {
  test('throw error when missing tag', () => {
    expect(h(null, null)).throwError(/invalid tag/)
  })

  // test('create an html element ', () => {
  //   expect(h(() => null, null))
  //   expect(h(() => null, null, 'text'))
  // })

  // test('create an functional element ', () => {
  //   expect(h(() => null, null, 'text'))
  //   expect(h(() => null, null, 'text'))
  // })

  class App extends Component {
    public render(): VNode {
      return h(null, null, null)
    }
  }

  test('create an class element ', () => {
    expect(h(App, null, 'text'))
    expect(h(App, null, 'text'))
  })
})
