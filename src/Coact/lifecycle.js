export const LIFECYCLES = {
  componentDidMount: 'componentDidMount',
  shouldComponentUpdate: 'shouldComponentUpdate',
  componentWillUnmount: 'componentWillUnmount',
  componentWillReceiveProps: 'componentWillReceiveProps'
}

export function callLifeCycle(lifecycle, instance, ...args) {
  if (!lifecycle || !instance[lifecycle]) return true
  return instance[lifecycle](...args)
}
