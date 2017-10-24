/**
 * This class is an item rendered in chatDetail
 */
import React from 'react'
import { Panel } from 'react-bootstrap'

export default (props) => {
    return (
        <div>
            <Panel bsStyle={ props.data.to ?  "danger" : "info"}
                   header={props.data.to ? props.data.nickname + ' whispers to '
                   + props.data.to : props.data.nickname + ' says'}>
                {props.data.message}
            </Panel>
        </div>
    )
}