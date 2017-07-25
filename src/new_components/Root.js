//@flow
import React from 'react'
import styled from 'styled-components'
import AppBar from 'material-ui/AppBar'
import { compose, withStateHandlers } from 'recompose'
import type {HOC} from 'recompose'

import Content from './Content'

const RootDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
let Root = ({ drawerOpen, toggleDrawerOpen }) =>
  <RootDiv>
    <AppBar onLeftIconButtonTouchTap={toggleDrawerOpen} />
    <Content drawerOpen={drawerOpen} />
  </RootDiv>
let Root_:HOC<*,*> = compose(
  withStateHandlers(
    { drawerOpen: true },
    {
      setDrawerOpen: () => (drawerOpen: boolean) => ({ drawerOpen }),
      toggleDrawerOpen: ({ drawerOpen }) => () => ({ drawerOpen: !drawerOpen })
    }
  )
)
Root_ = Root_(Root)

export default Root_
