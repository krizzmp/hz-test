//@flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, Task, User } from '../types'
import type { Observable } from 'rxjs'
import Rx from 'rxjs'
import toSentenceCase_ from 'to-sentence-case'
import { FlatButton, Dialog, Subheader } from 'material-ui'
import UnclaimedTask from './Task'

const toSentenceCase: string => string = toSentenceCase_
let Tasks = ({
  tasks,
  claimedTasks,
  doneTasks,
  setSelectedTaskId,
  selectedTaskId,
  claim,
  remove,
  undone,
  unclaim,
  done
}) =>
  <div>
    <Subheader>Open Tasks</Subheader>
    {tasks.map((task: Task) =>
      <UnclaimedTask
        key={task.id}
        task={task}
        selected={task.id === selectedTaskId}
        onClick={() => setSelectedTaskId(task.id)}
        claim={claim}
        buttonText="Claim"
        delete={remove}
      />
    )}
    <Subheader>Done Tasks</Subheader>
    {doneTasks.map(task =>
      <UnclaimedTask
        key={task.id}
        task={task}
        selected={task.id === selectedTaskId}
        onClick={() => setSelectedTaskId(task.id)}
        claim={undone}
        buttonText="Undone"
        delete={remove}
      />
    )}
    {claimedTasks.map(task =>
      <Dialog
        key={task.id}
        title={toSentenceCase(task.title)}
        actions={[
          <FlatButton key="unclaim" label="Unclaim" onTouchTap={() => unclaim(task.id)} />,
          <FlatButton key="done" label="Done" primary={true} keyboardFocused={true} onTouchTap={() => done(task.id)} />
        ]}
        modal={false}
        open={true}
      >
        {toSentenceCase(task.description)}
      </Dialog>
    )}
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
      selectedTaskId: ''
    },
    {
      setSelectedTaskId: () => selectedTaskId => ({ selectedTaskId })
    }
  ),
  withHandlers({
    claim: ({ horizon, user }) => (id: string) => horizon('tasks').update({ id, claimedBy: user.id }),
    unclaim: ({ horizon }) => (id: string) => horizon('tasks').update({ id, claimedBy: '' }),
    done: ({ horizon }) => (id: string) => horizon('tasks').update({ id, done: true }),
    undone: ({ horizon }) => (id: string) => horizon('tasks').update({ id, done: false }),
    remove: ({ horizon }) => (id: string) => horizon('tasks').remove(id)
  })
)
const exp = enhance(Tasks)
export default exp
