// @flow
import React from 'react'
import { Connector } from 'horizon-react'
import App from './app'
import { createStore } from 'redux'
const Horizon = require('@horizon/client')

const horizon = Horizon({ authType: 'anonymous' });
console.log(horizon)
horizon.connect()
const store = createStore(s => s)
const App2 = () =>
  <Connector store={store} horizon={horizon}>
    <App />
  </Connector>

export default App2
