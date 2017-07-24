import React from 'react'
import styled from 'styled-components'
import { compose, withStateHandlers, getContext } from 'recompose'
import { mapPropsStream } from '../utils'
import type { Observable } from 'rxjs'
import PropTypes from 'prop-types'
import type { Horizon, Task, User } from '../types'
import Rx from 'rxjs'
import Tasks from './Tasks'
import Fab from './Fab'

const MainDiv = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 1.8rem;
`
let Main = ({ selectedProjectId, user}) =>
  <MainDiv>
    <Tasks projectId={selectedProjectId} user={user} />
    <Fab projectId={selectedProjectId} />
  </MainDiv>
Main = compose(
)(Main)

export default Main
