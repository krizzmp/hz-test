// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task, User } from '../types'
import styled from 'styled-components'
import type { Observable } from 'rxjs'
import Rx from 'rxjs'
import TextField from 'material-ui/TextField'
import toSentenceCase_ from 'to-sentence-case'
import { FlatButton, Dialog } from 'material-ui'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import UnclaimedTask from './Task'

const toSentenceCase: string => string = toSentenceCase_

const Fab = styled(FloatingActionButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`
const Tasks = props =>
  <div>
    <h1>tasks</h1>
    {props.tasks.map((task: Task) =>
      <UnclaimedTask
        key={task.id}
        task={task}
        selected={task.id === props.selectedTaskId}
        onClick={() => props.setSelectedTaskId(task.id)}
        claim={props.claim}
        buttonText="Claim"
        delete={props.delete}
      />
    )}
    <h6>done tasks</h6>
    {props.doneTasks.map(task =>
      <UnclaimedTask
        key={task.id}
        task={task}
        selected={task.id === props.selectedTaskId}
        onClick={() => props.setSelectedTaskId(task.id)}
        claim={props.undone}
        buttonText="Undone"
        delete={props.delete}
      />
    )}
    {props.claimedTasks.map(task =>
      <Dialog
        key={task.id}
        title={toSentenceCase(task.title)}
        actions={[
          <FlatButton key="unclaim" label="Unclaim" onTouchTap={() => props.unclaim(task.id)} />,
          <FlatButton
            key="done"
            label="Done"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => props.done(task.id)}
          />
        ]}
        modal={false}
        open={true}
      >
        {toSentenceCase(task.description)}
      </Dialog>
    )}
    <Fab onTouchTap={() => props.setEditing(true)}>
      <ContentAdd />
    </Fab>
    <Dialog
      title="Create Project"
      actions={[
        <FlatButton key="unclaim" label="Cancel" onTouchTap={() => props.setEditing(false)} />,
        <FlatButton key="done" label="Save" primary={true} onTouchTap={props.createTask} />
      ]}
      modal={false}
      open={props.editing}
      onRequestClose={() => props.setEditing(false)}
    >
      <TextField
        type="text"
        value={props.taskTitle}
        onChange={props.updateTaskTitleInput}
        floatingLabelText="Title"
        fullWidth={true}
      />
      <TextField
        type="text"
        value={props.taskDescription}
        onChange={props.updateTaskDescriptionInput}
        floatingLabelText="Description"
        multiLine={true}
        fullWidth={true}
      />
    </Dialog>
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
    delete: ({ horizon }) => (id: string) => horizon('tasks').remove(id),
    updateTaskDescriptionInput: ({ setTaskDescription }) => (e: SyntheticInputEvent) =>
      setTaskDescription(e.target.value)
  })
)
const exp = enhance(Tasks)
export default exp
