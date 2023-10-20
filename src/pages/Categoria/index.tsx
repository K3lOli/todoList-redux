import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo } from '../../store/reducers/todoReducer';


export function TodoList(){
  const todos = useSelector((state:any) => state.todos);
  const dispatch = useDispatch();

  return (
    <ul>
      {todos.map((todo:any) => (
        <li key={todo.id}>
          <span
            onClick={() => dispatch(toggleTodo(todo.id))}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
            }}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch(deleteTodo(todo.id))}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;