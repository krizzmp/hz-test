// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withHandlers, withState } from 'recompose'

import Project from './Tasks'

let asHz = observable => ({
  watch() {
    return observable
  }
})
let id = x => x

const ProjectItem = compose()(({ project, onClick, active }) =>
  <div className={'project' + (active ? ' active' : '')} onClick={() => onClick(project.id)}>
    {project.name}
  </div>
)
const Projects = props =>
  <div>
    <div className="project-creator-bar">
      <input type="text" value={props.projectName} onChange={props.updateProjectNameInput} />
      <button onClick={props.createProject}>Create Project</button>
    </div>
    <div className="projects">
      {props.projects.map(p =>
        <ProjectItem project={p} active={props.selectedProjectId === p.id} onClick={props.choose} />
      )}
    </div>
    {props.selectedProjectId ? <Project projectId={props.selectedProjectId} /> : <div>none</div>}
  </div>

export default compose(
  subscribe({
    mapDataToProps: {
      projects: hz =>
        asHz(
          id(hz.currentUser().watch())
            .flatMap(us => hz('upc').findAll({ uid: us.id }).watch())
            .flatMap(upcArr => {
              let map_ = upcArr.map(upc => ({ id: upc.pid }))
              return hz('projects').findAll(...map_).watch()
            })
        ),
      user: hz => hz.currentUser()
    }
  }),
  withState('projectName', 'setProjectName', ''),
  withState('selectedProjectId', 'setSelectedProjectId', ''),
  withHandlers({
    createProject: ({ horizon, user, projectName: name, setProjectName }) => () => {
      user.map(({ id: uid }) =>
        horizon('projects').store({ name }).subscribe(({ id: pid }) =>
          horizon('upc').store({
            uid,
            pid
          })
        )
      )
      setProjectName('')
    },
    updateProjectNameInput: ({ setProjectName }) => e => setProjectName(e.target.value),
    choose: ({ setSelectedProjectId }) => id => setSelectedProjectId(id)
  })
)(Projects)
