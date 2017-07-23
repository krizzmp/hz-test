// @flow
import React from 'react'
import styled from 'styled-components'
import { elevationString } from '../mixins'
import type { Children } from 'react'

const Fab = styled.div`
  display: inline-flex;
  position: relative;
  justify-content: center;
  min-width: 56px;
  min-height: 56px;
  padding: 0;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1), border-radius 680ms cubic-bezier(.4, 0, .2, 1), all 700ms;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  fill: currentColor;
  -moz-appearance: none;
  -webkit-appearance: none;
  overflow: hidden;
  box-shadow: ${elevationString(6)};
  visibility: visible;
  z-index: 6;
  &:active {
    box-shadow: ${elevationString(12)};
    z-index: 12;
  }
  &:hover {
    cursor: pointer;
  }
`
let transdur = '400ms'
const Fab2 = styled(Fab)`
  background-color: ${p => (p.editing ? '#fff' : '#fa9')};
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1), border-radius ${transdur} cubic-bezier(.4, 0, .2, 1), all ${transdur} cubic-bezier(.4, 0, .2, 1);
  margin: ${p => (p.editing ? 0 : 16)}px;
  height: ${p => (p.editing ? 300 : 56)}px;
  width: ${p => (p.editing ? 400 : 0)}px;
  border-radius: ${p => (p.editing ? 4 : 56)}px;
  display: flex;
  flex-direction: column;
`
let map = (a, b) => b && a
const Miv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  visibility: ${p => (p.editing ? 'visible' : 'hidden')};
  transition: visibility ${transdur} cubic-bezier(.4, 0, .2, 1), background ${transdur} cubic-bezier(.4, 0, .2, 1);
  background: rgba(0, 0, 0, ${p => (p.editing ? 0.6 : 0)});
  z-index: 6;
`
const F2 = styled.div`
  display: flex;
  flex-direction: column;
`
const F1 = styled.div`flex: 1;`
const F3 = styled.div`
  flex: ${p => (p.editing ? 1 : 0)};
  transition: flex ${transdur} cubic-bezier(.4, 0, .2, 1);
`
const Modal = styled.div`
  opacity: ${p => (p.editing ? 1 : 0)};
  transition: opacity 800ms;
  flex: ${p => (p.editing ? 1 : 0)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Miv2 = p =>
  <Miv editing={p.editing} onClick={p.onClick}>
    <F1 />
    <F2>
      <F1 />
      <div>
        {p.children}
      </div>
      <F3 editing={p.editing} />
    </F2>
    <F3 editing={p.editing} />
  </Miv>
type Props = {
  editing: boolean,
  onClick: Function,
  children?: Children
}
const Tasks = (props: Props) =>
  <Miv2 editing={props.editing} onClick={props.onClick}>
    <Fab2 editing={props.editing} onClick={props.onClick}>
      <Modal editing={props.editing} onClick={(e: Event) => e.stopPropagation()}>
        {map(props.children, props.editing)}
      </Modal>
    </Fab2>
  </Miv2>

export default Tasks
