import React from 'react'
import {Connector} from 'horizon-react'
import App from './app'
import {createStore} from 'redux'

let store = createStore(s => s)
export default class App2 extends React.Component {
  render() {
    return (
      <Connector store={store}>
        <App/>
      </Connector>
    )
  }
}
