import React from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'


let CreateProjectDialog = ({ editing, setEditing, createProject, projectName, updateProjectNameInput }) =>
  <Dialog
    title="Create Project"
    actions={[
      <FlatButton key="unclaim" label="Cancel" onTouchTap={() => setEditing(false)} />,
      <FlatButton key="done" label="Save" primary={true} onTouchTap={createProject} />
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
export default CreateProjectDialog
