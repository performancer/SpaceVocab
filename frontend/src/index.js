import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import App from './App'
import store from './store'

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
