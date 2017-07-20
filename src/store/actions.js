// @flow
import type { Horizon, User, ProjectT } from '../types'
type g = {horizon:Horizon, projectName:string, user:User}
export const createProject = ({horizon, projectName, user}:g)=>
  horizon('projects').store({ name: projectName }).subscribe((project: ProjectT) =>
    horizon('upc').store({ uid: user.id, pid: project.id })
  )
