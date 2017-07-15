// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { Connector } from 'horizon-react'
import App from './components/app'
import { createStore } from 'redux'
import Horizon_ from '@horizon/client'
import type { Horizon } from './types'
import { compose, getContext, withContext, withHandlers, withState, withStateHandlers } from 'recompose'

const horizon: Horizon = Horizon_({ authType: 'token' })

let App2
if (!horizon.hasAuthToken()) {
  App2 = () => <div className="test">f</div>
  horizon.authEndpoint('github').subscribe(endpoint => {
    location.replace(endpoint)
  })
} else {
  // We have a token already, do authenticated Horizon stuff here
  horizon.connect()
  App2 = withContext({ horizon: React.PropTypes.func }, () => ({ horizon: horizon }))(App)
}

ReactDOM.render(<App2 />, document.querySelector('.attach'))
