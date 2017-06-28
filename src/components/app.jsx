import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withState, withHandlers } from 'recompose'
import Messages from './messages'

const App = (props) =>
  <div>
    <div className="center">
      <button onClick={props.sendMessage}>Send Message</button>
      <input onChange={props.handleChangeAuthor} />
      <input onChange={props.handleChangeText} />
    </div>
    <Messages chat={props.chat} />
  </div>

// simple subscription to the collection "todos"
const mapDataToProps = {
  chat: hz => hz('messages')
}
export default compose(
  withState('text', 'setText', ''),
  withState('author', 'setAuthor', ''),
  subscribe({
    mapDataToProps
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
