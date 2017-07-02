// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withHandlers, withState } from 'recompose'
import Rx from 'rxjs'
import R from 'ramda'

let asHz = observable => ({
  watch() {
    return observable
  }
})
let id = x => x
const Projects = compose(
  subscribe({
    mapDataToProps: {
      projects: hz =>
        asHz(
          id(hz.currentUser().watch()) // $<user>
            .flatMap(
              us => hz('upc').findAll({ uid: us.id }).watch() // $<[upc]>
            ) // $<[upc]>
            .flatMap(upcArr => {
              let map = upcArr.map(upc => hz('projects').find({ id: upc.pid }).watch()) // [$<project>]
              return Rx.Observable.combineLatest(map, (...args) => R.flatten(args)) // $<[project]>
            }) // $<[project]>
        ),
      user: hz => hz.currentUser()
    }
  }),
  withState('projectName', 'setProjectName', ''),
  withHandlers({
    createProject: ({ horizon, user, projectName: name }) => () => {
      user.map(({ id: uid }) =>
        horizon('projects').store({ name }).subscribe(({ id: pid }) =>
          horizon('upc').store({
            uid,
            pid
          })
        )
      )
    },
    updateProjectNameInput: ({ setProjectName }) => e => setProjectName(e.target.value)
  })
)(props =>
  <div>
    <div className="center">
      <input type="text" value={props.projectName} onChange={props.updateProjectNameInput} />
      <button onClick={props.createProject}>Create Project</button>
    </div>
    <div className="projects">
      {props.projects.map(u => <div>{u.name}</div>)}
    </div>
  </div>
)
export default Projects
