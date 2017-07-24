import React from 'react'
import styled from 'styled-components'
import Main from './Main'
import SideBar from './SideBar'

import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, withStateHandlers } from 'recompose'
import { mapPropsStream } from '../utils'
import { getProjects } from '../store/selectors'
import type { Horizon } from '../types'

const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`
let Content = ({ drawerOpen, selectedProjectId, setSelectedProjectId, user, projects }) =>
  <ContentDiv>
    <SideBar
      drawerOpen={drawerOpen}
      setSelectedProjectId={setSelectedProjectId}
      selectedProjectId={selectedProjectId}
      projects={projects}
    />
    {selectedProjectId !== '' ? <Main selectedProjectId={selectedProjectId} user={user} /> : <div />}
  </ContentDiv>
Content = compose(
  getContext({ horizon: ((PropTypes.func: any): Horizon) }),
  mapPropsStream(getProjects()),
  withStateHandlers(
    {
      editing: false,
      selectedProjectId: ''
    },
    {
      setEditing: () => editing => ({ editing }),
      setSelectedProjectId: () => (selectedProjectId: string) => ({ selectedProjectId })
    }
  )
)(Content)
export default Content
