// @flow
import React from 'react'
import styled from 'styled-components'
import type { User } from '../types'
import Tasks from './Tasks'
import Fab from './Fab'

const MainDiv = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 1.8rem;
`
type baseTypes = {
  selectedProjectId: string,
  user: User
}
let Main = ({ selectedProjectId, user }: baseTypes) =>
  <MainDiv>
    <Tasks projectId={selectedProjectId} user={user} />
    <Fab projectId={selectedProjectId} />
  </MainDiv>

export default Main
