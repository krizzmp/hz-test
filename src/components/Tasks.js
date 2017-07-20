// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task } from '../types'
import styled from 'styled-components'
import windowDimensions from 'react-window-dimensions'
import FabModal from './FabModal'
import type {Observable} from 'rxjs'


const TaskStyle = styled.div``
const TaskCreatorBar = styled.div`
  padding: 8px;
  z-index: 16;
`
const Input = styled.input`
  background: #eeeeee;
  border: 1px solid #dddddd;
  border-radius: 4px;
`
const Button = styled.button`
  background: #eeeeee;
  border: 1px solid #dddddd;
  border-radius: 4px;
`
const TaskItem = props =>
  <TaskStyle>
    {props.task.title}
  </TaskStyle>
const Tasks = props =>
  <div>
    <h1>tasks</h1>
    {props.tasks.map(task => <TaskItem key={task.id} task={task} />)}
    <FabModal editing={props.editing} onClick={() => props.setEditing(!props.editing)}>
      <TaskCreatorBar>
        <Input type="text" value={props.taskTitle} onChange={props.updateTaskTitleInput} />
        <Button onClick={props.createTask}>Create Project</Button>
      </TaskCreatorBar>
    </FabModal>
    {/* <AddTask height={props.height} width={props.width} editing={props.editing} onClick={() => props.setEditing(!props.editing)} /> */}
  </div>

const enhance: HOC<*, { projectId: string, width: number, height: number }> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(props$ => {
    return props$.flatMap(props => {
      let tasks$: Observable<Task[]> = props.horizon('tasks').findAll({ projectId: props.projectId }).watch()
      return tasks$.map(arr => ({ ...props, tasks: arr }))
    })
  }),
  withStateHandlers(
    { taskTitle: '', editing: false },
    {
      setTaskTitle: () => (taskTitle: string) => ({ taskTitle }),
      setEditing: () => (editing: boolean) => ({ editing })
    }
  ),
  withHandlers({
    createTask: ({ horizon, setTaskTitle, projectId, taskTitle, setEditing }) => () => {
      horizon('tasks').store({ projectId, title: taskTitle })
      setTaskTitle('')
      setEditing(false)
    },
    updateTaskTitleInput: ({ setTaskTitle }) => (e: SyntheticInputEvent) => setTaskTitle(e.target.value)
  })
)
let wd: HOC<{ projectId: string, width: number, height: number }, { projectId: string }> = windowDimensions()
const exp = wd(enhance(Tasks))
export default exp
