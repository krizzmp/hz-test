// @flow
import React from 'react'
import { subscribe } from 'horizon-react'
import { compose, withHandlers, withState } from 'recompose'

const Projects = props =>
  <div>
    <div className="project-creator-bar">
      <input type="text" value={props.taskTitle} onChange={props.updateProjectNameInput} />
      <button onClick={props.createTask}>Create Project</button>
    </div>
    {props.tasks.map(task => <div className="task">{task.title}</div>)}
  </div>

export default compose(
  subscribe({
    mapDataToProps: {
      tasks: (hz, props) => {
        return hz('tasks').findAll({ projectId: props.projectId })
      }
    }
  }),
  withState('taskTitle', 'setTaskTitle', ''),
  withHandlers({
    createTask: ({ horizon, setTaskTitle, projectId, taskTitle }) => () => {
      horizon('tasks').store({ projectId, title: taskTitle })
      setTaskTitle('')
    },
    updateProjectNameInput: ({ setTaskTitle }) => e => setTaskTitle(e.target.value)
  })
)(Projects)
