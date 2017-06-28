// @flow
import React from 'react'
import Message from './message'
type msg = {
  author: string,
  text: string
}
type g = {
  chat: msg[]
}
const Messages = ({ chat }: g) =>
  <div className="container-fluid">
    {chat.map((message, i) => <Message msg={message} key={i} />)}
  </div>
export default Messages
