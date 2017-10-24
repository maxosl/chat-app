import React, { Component } from 'react'
import ChatLog from '../views/chat-views/chatLog'
import { InputGroup, PageHeader, Button, FormGroup, FormControl, Grid, Col } from 'react-bootstrap'
import UsersContainer from './usersContainer'

class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input : '',
            messages: [],
            connected: false,
            socket: props.socket,
            nickname: props.nickname,
            sendTo: ''
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this._handleMessageEvent = this._handleMessageEvent.bind(this);
    }

    /**
     * Join the chat and notify all users of this event and wire socket.io event listeners
     */
    componentDidMount(){
        this.state.socket.emit('join', {'nickname':this.state.nickname});
        this._handleMessageEvent();
    }

    /**
     * This is a callback passed to UserClient and is used to set the person to send to/all users
     * @param nickname - person to send to. If empty or null messages will be sent to all users
     */
    setSendTo = (nickname) => {
        this.setState({'sendTo': nickname});
    };

    handleOnChange(ev) {
        this.setState({ input: ev.target.value});
    }

    /**
     * Send a message
     * @param ev
     */
    handleOnSubmit(ev) {
        ev.preventDefault();
        let message = {message: this.state.input, nickname: this.state.nickname, to:this.state.sendTo};
        this.state.socket.emit('newMsg', message);
        this.state.messages.push(message);
        this.setState({ input: '' });
    }

    /**
     * Handle new messages here. If a private message is sent
     * only the owner of the target socket receive this event.
     * @private
     */
    _handleMessageEvent(){
        this.state.socket.on('newMsg', (inboundMessage) => {
            this.state.messages.push(inboundMessage);
            this.setState({'messages': this.state.messages});
        })
    }

    render() {
        return (
            <div>
                <PageHeader> Welcome to Chat App, {this.state.nickname} </PageHeader>
                <Grid >
                    <Col md={2} xs={2} sm={2}>
                        <UsersContainer nickname={this.state.nickname} socket={this.state.socket} setSendTo={this.setSendTo}/>
                    </Col>
                    <Col md={10} xs={10} sm={10}>
                        <ChatLog messages={this.state.messages} />
                        <form >
                            <FormGroup>
                                <InputGroup>
                                    <FormControl onChange={this.handleOnChange} value={this.state.input}/>
                                    <InputGroup.Button>
                                        <Button bsStyle="primary" type="submit" onClick={this.handleOnSubmit}> Send </Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </FormGroup>
                        </form>
                    </Col>

                </Grid>

            </div>
        )
    }

}

export default ChatContainer;