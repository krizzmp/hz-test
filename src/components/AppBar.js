// @flow
import React from 'react'
import styled from 'styled-components'
import { elevationString } from '../mixins'

const AB = styled.div`
  height: 64px;
  z-index: 4;
  background-color: #3f51b5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: ${elevationString(4)};
`
const ABC = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 24px;
  align-items: center;
`
const Title = styled.div`
  margin-left: 24px;
  font-size: 20px; /* 20sp */
  font-weight: 500;
  letter-spacing: .02em;
  color: #fff;
`
const Icon = styled.i`
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;
  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;
  /* Support for IE. */
  font-feature-settings: 'liga';
  color: rgba(255, 255, 255, 1);
`
type Props = {
  title: string,
  onChange: () => void
}
const AppBar = (p: Props) =>
  <AB>
    <ABC>
      <Icon onClick={p.onChange}>menu</Icon>
      <Title>
        {p.title}
      </Title>
    </ABC>
  </AB>

export default AppBar
