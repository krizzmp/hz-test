// @flow
import type { Horizon, User, Upc, ProjectT } from '../types'
import type { Observable } from 'rxjs'
import R from 'rxjs'
export const getProjects = () => (props$: Observable<{ horizon: Horizon }>) =>
  props$.flatMap(props =>
    props.horizon.currentUser().watch().flatMap((user: User) =>
      props.horizon('upc').findAll({ uid: user.id }).watch().flatMap((upcs: Upc[]) => {
        if (upcs.length > 0) {
          return props
            .horizon('projects')
            .findAll(...upcs.map(upc => ({ id: upc.pid })))
            .watch()
            .map((projects: ProjectT[]) => ({ ...props, projects: projects, user: user }))
        } else {
          return R.Observable.of({ ...props, projects: [], user: user })
        }
      })
    )
  )
