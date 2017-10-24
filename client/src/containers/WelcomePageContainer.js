import React, { Component } from 'react'
import { InputGroup, Button, PageHeader, FormGroup, FormControl } from 'react-bootstrap'


class WelcomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            input: ''
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSumbit.bind(this);
        this._setupListeners = this._setupListeners.bind(this);
    }

    componentDidMount() {
        this._setupListeners();
    }

    /**
     * Setup nickname validation listeners
     * @private
     */
    _setupListeners(){
        this.props.socket.on('nickSet', () =>{
            //use setNickname callback from App to signal it is set
            this.props.setNickname(this.state.input);
        });

        this.props.socket.on('nickExists', () =>{
            alert('Nickname exists, please choose a different one');
        });
    }

    handleOnChange(ev){
        this.setState({input: ev.target.value});
    }

    handleOnSumbit(ev){
        ev.preventDefault();
        //get nickname from state
        let nickname = this.state.input;
        if (nickname){
            this.props.socket.emit('setNick', {'nickname':nickname});
        }
        else{
            alert('Nickname cannot be empty');
        }
    }

    render(){
        return (
            <div>
                <PageHeader> Welcome! Please choose a nickname: </PageHeader>
                <form onSubmit={this.handleOnSubmit}>
                    <FormGroup>
                        <InputGroup value={this.state.input}>
                            <FormControl onChange={this.handleOnChange} />
                            <Button bsStyle="primary" type='submit'> Submit </Button>
                        </InputGroup>
                    </FormGroup>
                </form>
            </div>
        )
    }
}

export default WelcomePage;