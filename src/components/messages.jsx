// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withState, withHandlers } from 'recompose'

import Message from './message'

const App = props =>
  <div>
    <div className="center">
      <button onClick={props.sendMessage}>Send Message</button>
      <input onChange={props.handleChangeAuthor} />
      <input onChange={props.handleChangeText} />
    </div>
    <div className="container-fluid">
      {props.chat.map((message, i) => <Message msg={message} key={i} />)}
    </div>
  </div>
export default compose(
  withState('text', 'setText', ''),
  withState('author', 'setAuthor', ''),
  subscribe({
    mapDataToProps: {
      chat: hz => hz('messages')
    }
  }),
  withHandlers({
    handleChangeAuthor: ({ setText }) => event => setText(event.target.value),
    handleChangeText: ({ setAuthor }) => event => setAuthor(event.target.value),
    reset: ({ setText, setAuthor }) => () => {
      setText('')
      setAuthor('')
    },
    sendMessage: ({ horizon, reset, text, author }) => () => {
      reset()
      horizon('messages').store({ text, author })
    }
  })
)(App)
