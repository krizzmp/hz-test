// @flow
import React from 'react'
import styled from 'styled-components'
import { compose, withStateHandlers } from 'recompose'
import { List, ListItem, Divider } from 'material-ui'
import muiThemeable from 'material-ui/styles/muiThemeable'
import CreateProjectDialog from './CreateProjectDialog'
import type { ProjectT } from '../types'
import type { HOC } from 'recompose'

const Li = muiThemeable()(({ active, muiTheme, ...props }) =>
  <ListItem style={active ? { color: muiTheme.palette.primary1Color } : {}} {...props} />
)
const SideBarDiv = styled.div`
  overflow-y: auto;
  width: ${({ drawerOpen }) => (drawerOpen ? 64 * 3 : 0)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  transition: width 0.195s 0ms cubic-bezier(.4, 0, 0.6, 1);
`
let Content = ({
  drawerOpen,
  selectedProjectId,
  setSelectedProjectId,
  editing,
  setEditing,
  projects = [],
  createProject
}) =>
  <SideBarDiv drawerOpen={drawerOpen}>
    <List>
      {projects.map(p =>
        <Li
          key={p.id}
          primaryText={p.name}
          onClick={() => setSelectedProjectId(p.id)}
          active={selectedProjectId === p.id}
        />
      )}
    </List>
    <Divider />
    <List>
      <ListItem primaryText="Create Project" onClick={() => setEditing(true)} />
    </List>
    <CreateProjectDialog editing={editing} setEditing={setEditing} createProject={createProject} />
  </SideBarDiv>
type baseTypes = {
  drawerOpen: boolean,
  selectedProjectId: string,
  setSelectedProjectId: (id: string) => void,
  projects: ProjectT[],
  createProject: (projectName: string) => void
}
const enhance: HOC<*, baseTypes> = compose(
  withStateHandlers(
    {
      editing: false
    },
    {
      setEditing: () => (editing: boolean) => ({ editing })
    }
  )
)
const exp = enhance(Content)
export default exp
