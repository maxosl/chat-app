import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import WelcomePage from './containers/WelcomePageContainer'
import ChatContainer from './containers/ChatContainer'
import ConnectionError from './views/error-views/connectionError'
import Connecting from './views/buffering-views/connecting'


const socketURI = process.env.REACT_APP_SOCKET_URI;
const socketOptions = {transports: ['websocket']};

class App extends Component {
    constructor() {
        super();
        this.state = {
            nickname: '',
            socket: null,
            connected: false,
            error: null
        };
    }

    componentWillMount() {
        let socket = socketIOClient.connect(socketURI, socketOptions);
        this.setState({'socket': socket});
    }

    componentDidMount() {
        this.state.socket.on('connect', () => {
            this.setState({'connected': true});
        });

        this.state.socket.on('connect_error', (err)=>{
            this.setState({'error':err});
        });
    }

    /**
     * Callback passed to WelcomePageContainer - passed to PublicChatContainer
     * @param nickname
     */
    setNickname = (nickname) => {
        this.setState({'nickname': nickname});
    };

    render() {
        return (
            <div>
                {this.state.connected ?
                    this.state.nickname ?
                        <ChatContainer nickname={this.state.nickname} socket={this.state.socket}/>
                        : <WelcomePage setNickname={this.setNickname} socket={this.state.socket}/>
                    :this.state.error ?
                        <ConnectionError />
                        : <Connecting/>}
            </div>
        );
    }
}
export default App;