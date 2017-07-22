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
import toSentenceCase_ from 'to-sentence-case'
import AppBar from './AppBar'
import ReactModal from 'react-modal'
const toSentenceCase: string => string = toSentenceCase_
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
const MenuItem = styled.div`
  height: 32px;
  padding-left: 24px;
  display: flex;
  align-items: center;
  background: ${(p: { active: boolean }) => (p.active ? '#eeeeee' : 'inherit')};
  :hover {
    background: ${(p: { active: boolean }) => (p.active ? '#eeeeee' : '#f5f5f5')};
  }
`
const List = styled.div`margin: 8px 0;`
const MI = p =>
  <MenuItem active={p.active} onClick={p.onClick}>
    {toSentenceCase(p.caption)}
  </MenuItem>
const Divider = styled.hr`
  margin: 4px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`
const LayoutTest = props =>
  <Root>
    <AppBar checked={props.drawerPinned} title={'Taskr'} onChange={() => props.toggleDrawerPinned()} />
    <Container>
      <Drawer pinned={props.drawerPinned}>
        <List>
          {props.projects.map(p =>
            <MI
              key={p.id}
              caption={p.name}
              onClick={() => props.setSelectedProjectId(p.id)}
              active={props.selectedProjectId === p.id}
            />
          )}
          <Divider />
          <MI caption={'create project'} onClick={() => props.setEditing(true)} active={false} />
          <ReactModal
            isOpen={props.editing}
            contentLabel="Minimal Modal Example"
            onRequestClose={() => props.setEditing(false)}
            shouldCloseOnOverlayClick={true}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
              },
              content: {
                color: 'lightsteelblue',
                height: 500,
                zIndex: 12
              }
            }}
          >
            <button onClick={() => props.setEditing(false)}>Close Modal</button>
            <input type={'text'} onChange={props.updateProjectNameInput} value={props.projectName} />
            <button onClick={props.createProject}>create project</button>
          </ReactModal>
        </List>
      </Drawer>
      <Content>
        {or(props.selectedProjectId, <Project projectId={props.selectedProjectId} user={props.user}/>, <div>none</div>)}
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
