import React, { Component } from 'react'
import Messages from './messages'
//include our newly installed horizon client
const Horizon = require('@horizon/client')
const horizon = Horizon({ secure: false })
//this initiates our 'messages' collection inside of our Rethinkdb
const chat = horizon('messages')

class App extends Component {
  //init our state with the built in constructor function
  constructor(props) {
    super(props)
    this.state = {
      author: false,
      text: false
    }
  }

  //these two handle change events will watch our form values,
  //and update our state
  handleChangeAuthor(event) {
    this.setState({ author: event.target.value })
  }

  handleChangeText(event) {
    this.setState({ text: event.target.value })
  }

  sendMessage() {
    //check for empty strings and return early if a message/author
    //isn't entered
    if (this.state.text === false || this.state.author === false) {
      alert('Invalid Submission')
      return
    }
    let message = {
      text: this.state.text,
      author: this.state.author
    }
    //the store method will take our new message and store it in our
    //Rethink collection
    chat.store(message)
  }

  render() {
    return (
      <div>
        <div className="center">
          <button onClick={this.sendMessage.bind(this)}>Send Message</button>
          <input onChange={this.handleChangeAuthor.bind(this)} />
          <input onChange={this.handleChangeText.bind(this)} />
        </div>
        {/* pass chat as a prop to Messages Component for*/}
        {/* Querying the database for messages*/}
        <Messages chat={chat} />
      </div>
    )
  }
}

export default App
