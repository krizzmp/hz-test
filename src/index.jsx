// @flow
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import App from './new_components/Root'
import Horizon_ from '@horizon/client'
import type { Horizon } from './types'
import { withContext } from 'recompose'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()
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

const Apped = () =>
  <MuiThemeProvider>
    <Ape />
  </MuiThemeProvider>

ReactDOM.render(<Apped />, document.querySelector('.attach'))
