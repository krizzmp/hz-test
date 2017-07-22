// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task, User } from '../types'
import styled from 'styled-components'
import FabModal from './FabModal'
import type { Observable } from 'rxjs'
import Rx from 'rxjs'
import { elevationString } from '../mixins'
import toSentenceCase_ from 'to-sentence-case'

const toSentenceCase: string => string = toSentenceCase_
const TaskStyle = styled.div`
  box-shadow: ${p => (p.selected ? elevationString(4) : elevationString(2))};
  margin-bottom: ${p => (p.selected ? 16 : 1)}px;
  margin-top: ${p => (p.selected ? 16 : 0)}px;
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
const BottomRow = styled.div`
  padding-left: 24px;
  padding-bottom: 16px;
  display: ${p => (p.selected ? 'flex' : 'none')};
  align-items: center;
`
const Claim = styled.button``
const TaskItem = props =>
  <TaskStyle selected={props.selected}>
    <Title selected={props.selected} onClick={props.onClick}>
      {toSentenceCase(props.task.title)}
    </Title>
    <Description selected={props.selected}>
      {toSentenceCase(props.task.description)}
    </Description>
    <BottomRow selected={props.selected}>
      <Claim onClick={() => props.claim(props.task.id)}>Claim</Claim>
    </BottomRow>
  </TaskStyle>
const TaskItem2 = props =>
  <TaskStyle selected={true}>
    <Title selected={true}>
      {toSentenceCase(props.task.title)}
    </Title>
    <Description selected={true}>
      {toSentenceCase(props.task.description)}
    </Description>
    <BottomRow selected={true}>
      <Claim onClick={() => props.unclaim(props.task.id)}>Unclaim</Claim>
      <Claim onClick={() => props.done(props.task.id)}>Done</Claim>
    </BottomRow>
  </TaskStyle>
const TaskItem3 = props =>
  <TaskStyle selected={true}>
    <Title selected={true}>
      {toSentenceCase(props.task.title)}
    </Title>
    <Description selected={true}>
      {toSentenceCase(props.task.description)}
    </Description>
    <BottomRow selected={true}>
      <Claim onClick={() => props.undone(props.task.id)}>undone</Claim>
    </BottomRow>
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
        claim={props.claim}
      />
    )}
    <h1>claimed tasks</h1>
    {props.claimedTasks.map(task => <TaskItem2 key={task.id} task={task} unclaim={props.unclaim} done={props.done} />)}
    <h1>done tasks</h1>
    {props.doneTasks.map(task => <TaskItem3 key={task.id} task={task} unclaim={props.unclaim} undone={props.undone} />)}
    <FabModal editing={props.editing} onClick={() => props.setEditing(!props.editing)}>
      <TaskCreatorBar>
        <Input type="text" value={props.taskTitle} onChange={props.updateTaskTitleInput} />
        <Input type="text" value={props.taskDescription} onChange={props.updateTaskDescriptionInput} />
        <Button onClick={props.createTask}>Create Task</Button>
      </TaskCreatorBar>
    </FabModal>
  </div>

const enhance: HOC<*, { projectId: string, user: User }> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(props$ => {
    return props$.flatMap(props => {
      const findTasks = (...obj): Observable<Task[]> => props.horizon('tasks').findAll(...obj).watch()
      let tasks$ = findTasks({ projectId: props.projectId, claimedBy: '', done: false })
      let claimedTasks$ = findTasks({ projectId: props.projectId, claimedBy: props.user.id, done: false })
      let doneTasks$ = findTasks({ projectId: props.projectId, done: true })
      return Rx.Observable.combineLatest(tasks$, claimedTasks$, doneTasks$, (tasks, claimedTasks, doneTasks) => ({
        ...props,
        tasks,
        claimedTasks,
        doneTasks
      }))
    })
  }),
  withStateHandlers(
    {
      taskTitle: '',
      taskDescription: '',
      editing: false,
      selectedTaskId: ''
    },
    {
      setTaskTitle: () => (taskTitle: string) => ({ taskTitle }),
      setTaskDescription: () => (taskDescription: string) => ({ taskDescription }),
      setSelectedTaskId: () => (selectedTaskId: string) => ({ selectedTaskId }),
      setEditing: () => (editing: boolean) => ({ editing })
    }
  ),
  withHandlers({
    createTask: ({
      horizon,
      setTaskTitle,
      projectId,
      taskTitle,
      setEditing,
      taskDescription,
      setTaskDescription
    }) => () => {
      horizon('tasks').store({ projectId, title: taskTitle, description: taskDescription, claimedBy: '', done: false })
      setTaskTitle('')
      setTaskDescription('')
      setEditing(false)
    },
    updateTaskTitleInput: ({ setTaskTitle }) => (e: SyntheticInputEvent) => setTaskTitle(e.target.value),
    claim: ({ horizon, user }) => (id: string) => horizon('tasks').update({ id, claimedBy: user.id }),
    unclaim: ({ horizon }) => (id: string) => horizon('tasks').update({ id, claimedBy: '' }),
    done: ({ horizon }) => (id: string) => horizon('tasks').update({ id, done: true }),
    undone: ({ horizon }) => (id: string) => horizon('tasks').update({ id, done: false }),
    updateTaskDescriptionInput: ({ setTaskDescription }) => (e: SyntheticInputEvent) =>
      setTaskDescription(e.target.value)
  })
)
const exp = enhance(Tasks)
export default exp
