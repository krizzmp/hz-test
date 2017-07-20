// @flow
import type { Horizon, User, Upc, ProjectT } from '../types'
import type {Observable} from 'rxjs'

export const getProjects = () => (props$:Observable<{horizon:Horizon}>) =>
  props$.flatMap(props =>
    props.horizon.currentUser().watch().flatMap((user: User) =>
      props.horizon('upc').findAll({ uid: user.id }).watch().flatMap((upcs: Upc[]) =>
        props.horizon('projects').findAll(...upcs.map(upc => ({ id: upc.pid }))).watch().map((projects: ProjectT[]) =>
          ({ ...props, projects: projects, user: user }))
      )
    )
  )
