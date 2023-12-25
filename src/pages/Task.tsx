import './task.css'

interface TaskProps {
  task: any;
}

const Task = ({ task }: TaskProps) => {
  return (
    <a>
      <div>
        <h1>{task.task_title}</h1>
        <p>{task.task_description}</p>
        <p>{task.task_price}</p>
      </div>
    </a>
  )
}

export default Task;
  