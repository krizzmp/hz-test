// @flow-weak
import React from 'react'
import styled from 'styled-components'
import { elevationString } from '../mixins'
import toSentenceCase_ from 'to-sentence-case'
import { FlatButton } from 'material-ui'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import type { Task } from '../types'
import { MarkdownPreview } from 'react-marked-markdown'

const toSentenceCase: string => string = toSentenceCase_

const TaskStyle = styled.div`
  box-shadow: ${p => (p.selected ? elevationString(4) : elevationString(0))};
  border: 1px solid #bdbdbd;
  margin-bottom: ${p => (p.selected ? 16 : -1)}px;
  margin-top: ${p => (p.selected ? 16 : 0)}px;
  background: #fff;
  transition: margin 195ms linear, box-shadow 195ms linear;
`
const Title = styled.div`flex: 1;`
const Description = styled.div`
  font-size: 14px;
  padding-left: 24px;
  padding-bottom: 16px;
  display: ${p => (p.selected ? 'flex' : 'none')};
  flex-direction: column;
  transition: height 195ms linear;
  h1 {
    font-size: 24px;
  }
`
const BottomRow = styled.div`
  padding-left: 16px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0);
  display: ${p => (p.selected ? 'flex' : 'none')};
  align-items: center;
  justify-content: flex-end;
`
const TopRow = styled.div`
  height: ${p => (p.selected ? 64 : 48)}px;
  cursor: pointer;
  font-size: 15px;
  padding-left: 24px;
  display: flex;
  align-items: center;
  transition: height 195ms linear;
`
const IMenu = styled(IconMenu)`
  visibility: ${p => (p.selected ? 'visible' : 'hidden')};
  margin-right: 8px;
`
type proptypes = {
  selected: boolean,
  task: Task,
  buttonText: string,
  onClick: Function,
  delete: (id: string) => void,
  claim: (id: string) => void
}
const UnclaimedTask = (props: proptypes) =>
  <TaskStyle selected={props.selected}>
    <TopRow selected={props.selected} onClick={props.onClick}>
      <Title>
        {toSentenceCase(props.task.title)}
      </Title>
      <IMenu
        selected={props.selected}
        iconButtonElement={
          <IconButton>
            <MoreVertIcon color={'rgba(0,0,0, 0.54)'} />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Delete Task" onClick={() => props.delete(props.task.id)} />
      </IMenu>
    </TopRow>
    <Description selected={props.selected}>
      <MarkdownPreview
        value={props.task.description}
        markedOptions={{
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        }}
      />
    </Description>
    <BottomRow selected={props.selected}>
      <FlatButton label={props.buttonText} primary={true} onClick={() => props.claim(props.task.id)} />
    </BottomRow>
  </TaskStyle>

export default UnclaimedTask
