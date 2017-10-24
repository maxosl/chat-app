import React, { Component } from 'react'
import { ListGroup, ListGroupItem} from 'react-bootstrap'
import ScrollArea from 'react-scrollbar';

class UsersContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            socket: props.socket,
            chattingWith:''
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this._handleNewUser = this._handleNewUser.bind(this);
        this._handleUserLeaves = this._handleUserLeaves(this);
    }

    /**
     * Wire socketio event listeners
     */
    componentDidMount(){
        this._fetchUsers();
        this._handleNewUser();
    }

    handleOnClick(nickname){
        //set the recepient of the message with the setSendTo callback (defined in ChatContainer)
        this.props.setSendTo(nickname);
        this.setState({"chattingWith":nickname});
    }

    /**
     * New user joined event. Push his nickname into the users list
     * @private
     */
    _handleNewUser() {
        this.state.socket.on('userJoined', (data) => {
            this.state.users.push(data.nickname);
            this.setState({'users': this.state.users});
        });
    }

    /**
     * User left chat. Remove his nickname from users list.
     * Check if the removed user is also the one I've been chatting with, and if so set chattingWith and
     * sendTo properties to be empty.
     * @private
     */
    _handleUserLeaves() {
        this.state.socket.on('userLeft', (data) => {
            this.setState({'users': this.state.users.filter(nickname => nickname !== this.props.nickname)});
            if(this.state.chattingWith === data.nickname){
                this.setState({'chattingWith':''});
                this.props.setSendTo('');
            }
        })
    }

    /**
     * Get all users event. Received from server when the user joins.
     * @private
     */
    _fetchUsers(){
        this.state.socket.on('nicknameList', (data) => {
            this.setState({'users' :data.filter(nickname => nickname !== data.nickname)});
        });
    }

    render() {
        const users = this.state.users.map((nickname) => {
            return (
            <ListGroupItem key={nickname} onClick={this.handleOnClick.bind(null, nickname)}>
                    {nickname}
            </ListGroupItem>
            )
        });

        return (
            <ScrollArea speed={0.8}
                        className="area"
                        contentClassName="content"
                        horizontal={false}
                        style={{height:"60%"}}>
                <div>
                    <p>
                       { this.state.chattingWith ?
                            "Now chatting with: " + this.state.chattingWith :
                            "Chatting with all users"}</p>
                    <ListGroupItem onClick={this.handleOnClick.bind(null, '')}>
                        All
                    </ListGroupItem>
                    <hr/>
                    <ListGroup>
                        {users}
                    </ListGroup>
                </div>
            </ScrollArea>
        )

    }

}

export default UsersContainer;