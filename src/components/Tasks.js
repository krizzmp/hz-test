// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, getContext, withHandlers, withState, withStateHandlers } from 'recompose'
import {mapPropsStream} from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task } from '../types'
const Task_ = props =>
  <div className="task">
    {props.task.title}
  </div>
const Tasks = props =>
  <div>
    <div className="project-creator-bar">
      <input type="text" value={props.taskTitle} onChange={props.updateTaskTitleInput} />
      <button onClick={props.createTask}>Create Project</button>
    </div>
    <h1>tasks</h1>
    {props.tasks.map(task => <Task_ key={task.id} task={task} />)}
  </div>

const enhance: HOC<*, { projectId: string }> = compose(
  getContext({ horizon: ((React.PropTypes.func: any): Horizon) }),
  mapPropsStream(props$ => {
    return props$.flatMap(props => {
      let tasks$: rxjs$Observable<Task[]> = props.horizon('tasks').findAll({ projectId: props.projectId }).watch()
      return tasks$.map(arr => ({ ...props, tasks: arr }))
    })
  }),
  withStateHandlers(
    { taskTitle: '' },
    {
      setTaskTitle: state => (taskTitle: string) => ({
        taskTitle
      })
    }
  ),
  withHandlers({
    createTask: ({ horizon, setTaskTitle, projectId, taskTitle }) => () => {
      horizon('tasks').store({ projectId, title: taskTitle })
      setTaskTitle('')
    },
    updateTaskTitleInput: ({ setTaskTitle }) => (e: SyntheticInputEvent) => setTaskTitle(e.target.value)
  })
)
const exp = enhance(Tasks)
export default exp
