// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import type { HOC } from 'recompose'
import { mapPropsStream } from '../utils'
import type { Horizon } from '../types'
import { getProjects } from '../store/selectors'
import { createProject } from '../store/actions'
import Project from './Tasks'
import styled from 'styled-components'
import AppBar from 'material-ui/AppBar'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import { FlatButton, TextField } from 'material-ui'

const or = (p, y, n) => (p ? y : n)

const Content = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 1.8rem;
`
const Drawer = styled.div`
  overflow-y: auto;
  width: ${(p: { pinned: string }) => (p.pinned ? 64 * 3 + 'px' : 0)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  transition: width 0.195s 0ms cubic-bezier(.4, 0, 0.6, 1);
`
const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`

import muiThemeable from 'material-ui/styles/muiThemeable'

const DeepDownTheTree = ({ active, muiTheme, ...props }) =>
  <ListItem style={active ? { color: muiTheme.palette.primary1Color } : {}} {...props} />

const GE = muiThemeable()(DeepDownTheTree)
const LayoutTest = props =>
  <Root>
    <AppBar title="Taskr" onLeftIconButtonTouchTap={() => props.toggleDrawerPinned()} />
    <Container>
      <Drawer pinned={props.drawerPinned}>
        <List>
          {props.projects.map(p =>
            <GE
              key={p.id}
              primaryText={p.name}
              onClick={() => props.setSelectedProjectId(p.id)}
              active={props.selectedProjectId === p.id}
            />
          )}
        </List>
        <Divider />
        <List>

          <ListItem primaryText="Create Project" onClick={() => props.setEditing(true)} />
        </List>
        <Dialog
          title="Create Project"
          actions={[
            <FlatButton key="unclaim" label="Cancel" onTouchTap={() => props.setEditing(false)} />,
            <FlatButton key="done" label="Save" primary={true} onTouchTap={props.createProject} />
          ]}
          modal={false}
          open={props.editing}
          onRequestClose={() => props.setEditing(false)}
        >
          <TextField
            type="text"
            value={props.projectName}
            onChange={props.updateProjectNameInput}
            floatingLabelText="Project Name"
            fullWidth={true}
          />
        </Dialog>
      </Drawer>
      <Content>
        {or(
          props.selectedProjectId,
          <Project projectId={props.selectedProjectId} user={props.user} />,
          <div>none</div>
        )}
      </Content>
    </Container>
  </Root>

const enhance: HOC<*, {}> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(getProjects()),
  withStateHandlers(
    {
      editing: false,
      projectName: '',
      selectedProjectId: '',
      drawerPinned: true
    },
    {
      setProjectName: () => (projectName: string) => ({ projectName }),
      setEditing: () => (editing: boolean) => ({ editing }),
      setSelectedProjectId: () => (selectedProjectId: string) => ({ selectedProjectId }),
      toggleDrawerPinned: state => () => ({ drawerPinned: !state.drawerPinned })
    }
  ),
  withHandlers({
    createProject: ({ horizon, user, projectName, setProjectName, setEditing }) => () => {
      createProject({ horizon, user, projectName })
      setProjectName('')
      setEditing(false)
    },
    updateProjectNameInput: ({ setProjectName }) => (e: SyntheticInputEvent) => setProjectName(e.target.value)
  })
)
const exp = enhance(LayoutTest)
export default exp
