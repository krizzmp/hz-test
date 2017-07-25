// @flow
import React from 'react'
import styled from 'styled-components'
import { compose, withStateHandlers, getContext, withHandlers } from 'recompose'
import PropTypes from 'prop-types'
import type { Horizon } from '../types'
import { FlatButton, Dialog, TextField } from 'material-ui'
import type { HOC } from 'recompose'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

const Fab = styled(FloatingActionButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`
type propTypes = {
  setEditing: (b: boolean) => void,
  editing: boolean,
  createTask: () => void,
  taskTitle: string,
  taskDescription: string,
  updateTaskTitleInput: (e: SyntheticInputEvent) => void,
  updateTaskDescriptionInput: (e: SyntheticInputEvent) => void
}
let Main = (p: propTypes) =>
  <div>
    <Fab onTouchTap={() => p.setEditing(true)}>
      <ContentAdd />
    </Fab>
    <Dialog
      title="Create Project"
      actions={[
        <FlatButton key="unclaim" label="Cancel" onTouchTap={() => p.setEditing(false)} />,
        <FlatButton key="done" label="Save" primary={true} onTouchTap={p.createTask} />
      ]}
      modal={false}
      open={p.editing}
      onRequestClose={() => p.setEditing(false)}
    >
      <TextField
        type="text"
        value={p.taskTitle}
        onChange={p.updateTaskTitleInput}
        floatingLabelText="Title"
        fullWidth={true}
      />
      <TextField
        type="text"
        value={p.taskDescription}
        onChange={p.updateTaskDescriptionInput}
        floatingLabelText="Description"
        multiLine={true}
        fullWidth={true}
      />
    </Dialog>
  </div>
const enhance: HOC<*, { projectId: string }> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  withStateHandlers(
    {
      taskTitle: '',
      taskDescription: '',
      editing: false
    },
    {
      setTaskTitle: () => (taskTitle: string) => ({ taskTitle }),
      setTaskDescription: () => (taskDescription: string) => ({ taskDescription }),
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
    updateTaskDescriptionInput: ({ setTaskDescription }) => (e: SyntheticInputEvent) =>
      setTaskDescription(e.target.value)
  })
)
const exp = enhance(Main)

export default exp
