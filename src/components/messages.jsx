import React, { Component } from 'react'
import Message from './message'
class Messages extends Component {

  render() {
    let msgsjsx = this.props.chat.map(function(message, i) {
      return <Message msg={message} key={i} />
    })
    return (
      <div className="container-fluid">
        {msgsjsx}
      </div>
    )
  }
}
export default Messages
