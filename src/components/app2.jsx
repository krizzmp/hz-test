// @flow
import React from 'react'
import { Connector } from 'horizon-react'
import App from './app'
import { createStore } from 'redux'
const Horizon = require('@horizon/client')
let App2
const horizon = Horizon({ authType: 'token' });
if (!horizon.hasAuthToken()) {
  console.log('hi')
  App2 = () => (<div className="test">f</div>)
  horizon.authEndpoint('github').subscribe((endpoint) => {
    window.location.replace(endpoint);
  });
} else {
  // We have a token already, do authenticated Horizon stuff here
  console.log(horizon)
  horizon.connect()
  const store = createStore(s => s)
  App2 = () =>
    <Connector store={store} horizon={horizon}>
      <App />
    </Connector>
}
export default App2
