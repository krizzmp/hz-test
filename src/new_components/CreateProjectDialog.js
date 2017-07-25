// @flow
import React from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import { compose, withStateHandlers, getContext, withHandlers } from 'recompose'
import PropTypes from 'prop-types'
import type { HOC } from 'recompose'
import type { Horizon } from '../types'

let CreateProjectDialog = ({ editing, setEditing, createProject_, projectName, updateProjectNameInput }) =>
  <Dialog
    title="Create Project"
    actions={[
      <FlatButton key="unclaim" label="Cancel" onTouchTap={() => setEditing(false)} />,
      <FlatButton key="done" label="Save" primary={true} onTouchTap={createProject_} />
    ]}
    modal={false}
    open={editing}
    onRequestClose={() => setEditing(false)}
  >
    <TextField
      type="text"
      value={projectName}
      onChange={updateProjectNameInput}
      floatingLabelText="Project Name"
      fullWidth={true}
    />
  </Dialog>
type baseTypes = {
  editing: boolean,
  setEditing: (editing: boolean) => void,
  createProject: (projectName: string) => void
}
const enhance: HOC<*, baseTypes> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  withStateHandlers(
    {
      projectName: ''
    },
    {
      setProjectName: () => (projectName: string) => ({ projectName })
    }
  ),
  withHandlers({
    updateProjectNameInput: ({ setProjectName }) => (e: SyntheticInputEvent) => setProjectName(e.target.value),
    createProject_: ({ projectName, createProject, setProjectName, setEditing }) => () => {
      createProject(projectName)
      setProjectName('')
      setEditing(false)
    }
  })
)

const exp = enhance(CreateProjectDialog)
export default exp
