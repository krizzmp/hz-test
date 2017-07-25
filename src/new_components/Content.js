//@flow
import React from 'react'
import styled from 'styled-components'
import Main from './Main'
import SideBar from './SideBar'

import PropTypes from 'prop-types'
import { compose, getContext, withStateHandlers, withProps, withHandlers } from 'recompose'
import type { HOC } from 'recompose'
import { mapPropsStream } from '../utils'
import { getProjects } from '../store/selectors'
import type { Horizon } from '../types'
import R from 'ramda'
import {createProject} from '../store/actions'
let either = <T>(leftfn: (str: string) => T, rightfn: (str: string) => T, str: string) =>
  str === '' ? leftfn(str) : rightfn(str)
either = R.curry(either)
let loading = either(() => <div>no project selected</div>)
const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`
const Content = (p) =>
  <ContentDiv>
    <SideBar
      drawerOpen={p.drawerOpen}
      setSelectedProjectId={p.setSelectedProjectId}
      selectedProjectId={p.selectedProjectId}
      projects={p.projects}
      createProject={p.createProject}
    />
    {loading(() => <Main selectedProjectId={p.selectedProjectId} user={p.user} />, p.selectedProjectId)}
  </ContentDiv>

type g = { drawerOpen: boolean }
const enhance: HOC<*, g> = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(getProjects()),
  withStateHandlers(
    {
      editing: false,
      selectedProjectId: ''
    },
    {
      setEditing: () => (editing:boolean) => ({ editing }),
      setSelectedProjectId: () => (selectedProjectId: string) => ({ selectedProjectId }),
      createProject: (_, { horizon, user}) => (projectName:string) => {
        createProject({ horizon, user, projectName })
      }
    }
  ),
  withProps(({drawerOpen}:g)=>({drawerOpen}))
)
const exp = enhance(Content)
export default exp
