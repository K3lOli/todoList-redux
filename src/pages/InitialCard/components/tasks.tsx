import { useDispatch, useSelector } from "react-redux";
import styles from "./tasks.module.scss";
import { deleteTodo, toggleTodo } from "../../../store/reducers/todoReducer";
import { BsFillTrashFill } from 'react-icons/bs';

export default function Select() {
  const todos = useSelector((state: any) => state.todos);
  const dispatch = useDispatch();
  return (
    <div className={styles.todos}>
      {todos.map((todo: any) => (
        <div key={todo.id} className={styles.tasks}>
          <div className={styles.tasks__information} >
          <button onClick={() => dispatch(toggleTodo(todo.id))}>
            <div
              className={`${
                todo.completed ? styles.select__selected : styles.select
              }`}
            ></div>
          </button>
            <h3 style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}>{todo.text}</h3>
          </div>
          <div>
          <button style={{display:"flex", paddingRight:"20px"}}  onClick={() => dispatch(deleteTodo(todo.id))}>
            <BsFillTrashFill size={26} color='red'/>
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}
