import React, { Component } from 'react'
import Message from './message'
class Messages extends Component {
  constructor(props) {
    super(props)
    this.chat = props.chat
    //init our Messages state with and empty conversation array
    this.state = {
      convo: []
    }
  }
  //when our component mounts, it will call to the database with
  //this.chat.watch, setting the state and re-rendering our component
  //with our messages
  componentDidMount() {
    this.chat.watch().subscribe(
      messages => {
        let convo = messages.map(function(message) {
          return message
        })
        this.setState({ convo: convo })
      },
      err => {
        console.log(err)
      }
    )
  }
  //and our mappping function that used to render our dummy data,
  //now outputs our db messages
  render() {
    let msgsjsx = this.state.convo.map(function(message, i) {
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
