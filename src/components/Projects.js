// @flow
import React from 'react'
import { compose, getContext, withHandlers, withState, withStateHandlers } from 'recompose'
import {mapPropsStream} from '../utils'
import type { HOC } from 'recompose'
import type { Horizon, User, Upc, ProjectT } from '../types'

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
  getContext({ horizon: ((React.PropTypes.func: any): Horizon) }),
  mapPropsStream(props$ =>
    props$.flatMap(props =>
      props.horizon.currentUser().watch().flatMap((user:User) =>
        props.horizon('upc').findAll({uid:user.id}).watch().flatMap((upcs:Upc[]) =>
          props.horizon('projects').findAll(...upcs.map(upc => ({ id: upc.pid }))).watch().map((projects:ProjectT[]) =>
            ({ ...props, projects: projects, user: user })
          )
        )
      )
    )
  ),
  withStateHandlers(
    {
      projectName: '',
      selectedProjectId: ''
    },
    {
      setProjectName: state => (projectName: string) => ({ projectName }),
      setSelectedProjectId: state => (selectedProjectId: string) => ({ selectedProjectId })
    }
  ),
  withHandlers({
    createProject: ({ horizon, user, projectName, setProjectName }) => () => {
      horizon('projects')
        .store({ name: projectName })
        .subscribe((project: ProjectT) => horizon('upc').store({ uid: user.id, pid: project.id }))
      setProjectName('')
    },
    updateProjectNameInput: ({ setProjectName }) => (e: SyntheticInputEvent) => setProjectName(e.target.value)
  })
)
const exp = enhance(Projects)
export default exp
