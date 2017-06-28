// @flow
import React from 'react'
import { Connector } from 'horizon-react'
import App from './app'
import { createStore } from 'redux'

const store = createStore(s => s)
const App2 = () =>
  <Connector store={store}>
    <App />
  </Connector>

export default App2
