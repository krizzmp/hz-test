// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task } from '../types'
import styled from 'styled-components'
import FabModal from './FabModal'
import type { Observable } from 'rxjs'
import { elevationString } from '../mixins'
import toSentenceCase_ from 'to-sentence-case'

const toSentenceCase: string => string = toSentenceCase_
const TaskStyle = styled.div`
  box-shadow: ${p => (p.selected ? elevationString(4) : elevationString(2))};
  margin-bottom: ${p => (p.selected ? 16 : 1)}px;
  margin-top: ${p => (p.selected ? 16 : 1)}px;
  background: #fff;
  transition: margin 195ms linear;
  &:first-of-type {
    margin-top: 16px;
  }
`
const Title = styled.div`
  height: ${p => (p.selected ? 64 : 48)}px;
  cursor: pointer;
  font-size: 15px;
  padding-left: 24px;
  display: flex;
  align-items: center;
  transition: height 195ms linear;
`
const Description = styled.div`
  font-size: 12px;
  padding-left: 24px;
  padding-bottom: 16px;
  display: ${p => (p.selected ? 'flex' : 'none')};
  align-items: center;
  transition: height 195ms linear;
`
const TaskCreatorBar = styled.div``
const Input = styled.input``
const Button = styled.button``

const TaskItem = props =>
  <TaskStyle selected={props.selected}>
    <Title selected={props.selected} onClick={props.onClick}>
      {toSentenceCase(props.task.title)}
    </Title>
    <Description selected={props.selected}>deasdf is the big punch</Description>
  </TaskStyle>

const Tasks = props =>
  <div>
    <h1>tasks</h1>
    {props.tasks.map(task =>
      <TaskItem
        key={task.id}
        task={task}
        selected={task.id === props.selectedTaskId}
        onClick={() => props.setSelectedTaskId(task.id)}
      />
    )}
    <FabModal editing={props.editing} onClick={() => props.setEditing(!props.editing)}>
      <TaskCreatorBar>
        <Input type="text" value={props.taskTitle} onChange={props.updateTaskTitleInput} />
        <Button onClick={props.createTask}>Create Task</Button>
      </TaskCreatorBar>
    </FabModal>
  </div>

const enhance: HOC<*, { projectId: string }> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(props$ => {
    return props$.flatMap(props => {
      let tasks$: Observable<Task[]> = props.horizon('tasks').findAll({ projectId: props.projectId }).watch()
      return tasks$.map(arr => ({ ...props, tasks: arr }))
    })
  }),
  withStateHandlers(
    { taskTitle: '', editing: false, selectedTaskId: '' },
    {
      setTaskTitle: () => (taskTitle: string) => ({ taskTitle }),
      setSelectedTaskId: () => (selectedTaskId: string) => ({ selectedTaskId }),
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
const exp = enhance(Tasks)
export default exp
