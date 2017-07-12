// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, getContext, mapPropsStreamWithConfig, withHandlers, withState } from 'recompose'
import rxjsConfig from 'recompose/rxjsObservableConfig'
const mapPropsStream = mapPropsStreamWithConfig(rxjsConfig)

const Tasks = props =>
  <div>
    <h1>tasks</h1>
    {props.tasks.map(task => <div className="task">{task.title}</div>)}
  </div>

export default compose(
  getContext({ horizon: React.PropTypes.func }),
  mapPropsStream(props$ => {
    return props$.flatMap(props => {
      let tasks$ = props.horizon('tasks').findAll({ projectId: props.projectId }).watch()
      return tasks$.map(arr => ({ ...props, tasks: arr }))
    })
  })
)(Tasks)
