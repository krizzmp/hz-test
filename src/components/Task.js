import React from 'react'
import styled from 'styled-components'
import { elevationString } from '../mixins'
import toSentenceCase_ from 'to-sentence-case'
import { FlatButton } from 'material-ui'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const toSentenceCase: string => string = toSentenceCase_

const TaskStyle = styled.div`
  box-shadow: ${p => (p.selected ? elevationString(4) : elevationString(0))};
  border: ${p => (p.selected ? 'none' : '1px solid #BDBDBD')};
  margin-bottom: ${p => (p.selected ? 16 : -1)}px;
  margin-top: ${p => (p.selected ? 16 : 0)}px;
  background: #fff;
  transition: margin 195ms linear, box-shadow 195ms linear;
  &:first-of-type {
    margin-top: 16px;
  }
`
const Title = styled.div`flex: 1;`
const Description = styled.div`
  font-size: 12px;
  padding-left: 24px;
  padding-bottom: 16px;
  display: ${p => (p.selected ? 'flex' : 'none')};
  align-items: center;
  transition: height 195ms linear;
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
`
const UnclaimedTask = props =>
  <TaskStyle selected={props.selected}>
    <TopRow selected={props.selected} onClick={props.onClick}>
      <Title>
        {toSentenceCase(props.task.title)}
      </Title>
      <IMenu
        selected={props.selected}
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Delete Task" onClick={() => props.delete(props.task.id)} />
      </IMenu>
    </TopRow>
    <Description selected={props.selected}>
      {toSentenceCase(props.task.description)}
    </Description>
    <BottomRow selected={props.selected}>
      <FlatButton label={props.buttonText} primary={true} onClick={() => props.claim(props.task.id)} />
    </BottomRow>
  </TaskStyle>

export default UnclaimedTask
