import React, { Component } from 'react'

export default class Message extends Component {
  props: {
    msg: {
      author: string,
      text: string
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-2 center">{this.props.msg.author}</div>
        <div className="col-xs-10 center">{this.props.msg.text}</div>
      </div>
    )
  }
}
