// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withState, withHandlers } from 'recompose'
import Messages from './messages'
import Rx from 'rxjs'

let k = observable => ({
  watch() {
    return observable
  }
})

let log = (e, s) => {
  console.log(e, s)
  return e
}
const App = props =>
  <div>
    <div className="center">
      <button onClick={props.sendMessage}>Send Message</button>
      <button onClick={props.add}>add project</button>
      <button onClick={props.connect}>connect project</button>
      <input onChange={props.handleChangeAuthor} />
      <input onChange={props.handleChangeText} />
    </div>
    <Messages chat={props.chat} />
    <div className="user">

      {log(props.h, 'h').map(u => <div>{u.name}</div>)}
    </div>
  </div>
const mapDataToProps = {
  chat: hz => hz('messages'),
  user: hz => hz.currentUser(),
  h: hz =>
    k(
      hz.currentUser().watch()
        .flatMap(us => hz('upc').findAll({ uid: us.id }).watch())
        .flatMap(upcArr => Rx.Observable.from(upcArr))
        .flatMap(upc => hz('projects').findAll({ id: upc.pid }).watch())
    )
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
    },
    connect: ({ horizon,user }) => () => {
      horizon('upc').store({
        uid: user[0],
        pid: 'f4fd8137-a599-48a2-afb5-29898cea4e90'
      })
    },
    add: ({ horizon }) => () => {
      horizon('projects').store({ name: 'test' })
    }
  })
)(App)
