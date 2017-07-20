// @flow
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import App from './components/app'
import Horizon_ from '@horizon/client'
import type { Horizon } from './types'
import { withContext } from 'recompose'

const horizon: Horizon = Horizon_({ authType: 'token' })
let Ape
if (!horizon.hasAuthToken()) {
  let App2 = () => <div className="test">f</div>
  horizon.authEndpoint('github').subscribe(endpoint => {
    location.replace(endpoint)
  })
  Ape = App2
} else {
  // We have a token already, do authenticated Horizon stuff here
  horizon.connect()
  let App3 = withContext({ horizon: PropTypes.func }, () => ({ horizon: horizon }))(App)
  Ape = App3
}

ReactDOM.render(<Ape />, document.querySelector('.attach'))
