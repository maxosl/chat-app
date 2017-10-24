/**
 * This class renders the chat
 */
import React from 'react'
import ChatDetail from './chatDetail'
import {Row, Col } from 'react-bootstrap'
import ScrollArea from 'react-scrollbar';

export default (props) => {
    const messages = props.messages.map ( (message, i) => {
            return ( <ChatDetail key={i} data={message} /> )
    });
    return (
        <ScrollArea speed={0.8}
                    className="area"
                    contentClassName="content"
                    horizontal={false}
                    style={{height:"60%"}}>
            <div>
                <Row className="show-grid">
                    <Col xs={8}>
                        {messages}
                    </Col>
                </Row>
            </div>
        </ScrollArea>
    )
}
