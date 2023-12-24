import './taskcard.css'

interface TaskCardProps {
  task: any;
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <a>
      <div className="task-container">
        <h1>{task.task_title}</h1>
        <p>{task.task_description}</p>
        <p>{task.task_price}</p>
      </div>
    </a>
  )
}

export default TaskCard;
  