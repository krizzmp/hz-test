// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import {mapPropsStream} from '../utils'
import type { HOC } from 'recompose'
import type { Horizon } from '../types'
import {getProjects} from '../store/selectors'
import {createProject} from '../store/actions'

import Project from './Tasks'

let or = (p, y, n) => (p ? y : n)

const ProjectItem = ({ project, onClick, active }) =>
  <div className={'project' + (active ? ' active' : '')} onClick={() => onClick(project.id)}>
    {project.name}
  </div>

const Projects = props =>
  <div>
    <div className="project-creator-bar">
      <input type="text" value={props.projectName} onChange={props.updateProjectNameInput} />
      <button onClick={props.createProject}>Create Project</button>
    </div>
    <div className="projects">
      {props.projects.map(p =>
        <ProjectItem key={p.id} project={p} active={props.selectedProjectId === p.id} onClick={props.setSelectedProjectId} />
      )}
    </div>
    {or(props.selectedProjectId, <Project projectId={props.selectedProjectId} />, <div>none</div>)}
  </div>

const enhance: HOC<*, {}> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(getProjects()),
  withStateHandlers(
    {
      projectName: '',
      selectedProjectId: ''
    },
    {
      setProjectName: () => (projectName: string) => ({ projectName }),
      setSelectedProjectId: () => (selectedProjectId: string) => ({ selectedProjectId })
    }
  ),
  withHandlers({
    createProject: ({ horizon, user, projectName, setProjectName }) => () => {
      createProject({horizon, user, projectName})
      setProjectName('')
    },
    updateProjectNameInput: ({ setProjectName }) => (e: SyntheticInputEvent) => setProjectName(e.target.value)
  })
)
const exp = enhance(Projects)
export default exp
