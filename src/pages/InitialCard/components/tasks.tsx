import { useDispatch, useSelector } from "react-redux";
import styles from "./tasks.module.scss";
import { toggleTodo } from "../../../store/reducers/todoReducer";

export default function Select() {
  const todos = useSelector((state: any) => state.todos);
  const dispatch = useDispatch();
  return (
    <div className={styles.todos}>
      {todos.map((todo: any) => (
        <div key={todo.id} className={styles.tasks}>
          <div className={styles.tasks__information} >
            <h3 style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
            }}>{todo.text}</h3>
          </div>
          <button onClick={() => dispatch(toggleTodo(todo.id))}>
            <div
              className={`${
                todo.completed ? styles.select__selected : styles.select
              }`}
            ></div>
          </button>
        </div>
      ))}
    </div>
  );
}
