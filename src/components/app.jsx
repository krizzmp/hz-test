import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withState, withHandlers } from 'recompose'
import Messages from './messages'

const App = () =>
  <div>
    <div className="center">
      <button onClick={this.props.sendMessage}>Send Message</button>
      <input onChange={this.props.handleChangeAuthor} />
      <input onChange={this.props.handleChangeText} />
    </div>
    <Messages chat={this.props.chat} />
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
    sendMessage: ({ horizon, text, author }) => () => horizon('messages').store({ text, author })
  })
)(App)
