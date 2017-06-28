// @flow
import React from 'react'
type g = {
  msg: {
    author: string,
    text: string
  }
}
const Message = (props: g) =>
  <div className="row">
    <div className="col-xs-2 center">{props.msg.author}</div>
    <div className="col-xs-10 center">{props.msg.text}</div>
  </div>
export default Message
