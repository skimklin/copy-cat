import './index.css'
import C, { CoactDom } from './Coact/Coact'
import App from './app'

CoactDom.Render(
  () => C.createElement(App, null, null),
  document.getElementById('app')
)
