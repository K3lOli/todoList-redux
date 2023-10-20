import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../../store/reducers/todoReducer";
import "./index.css";
import { toggle } from "../../store/reducers/toggleReducer";

const TodoForm = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const toggleModal = useSelector((state: any) => state.toggle);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() !== "") {
      dispatch(toggle());
      dispatch(addTodo(text));
      setText("");
    }
  };

  const handleModalClick = (e:any) => {
    // Feche o modal apenas se o elemento clicado for a camada de fundo modal.
    if (e.target.classList.contains('modal')) {
      dispatch(toggle())
    }
  };

  return (
    <div>
      {toggleModal ? (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <span className="close-button">&times;</span>
            <form className="todo-form" onSubmit={handleSubmit}>
              <input
                className="todo-input"
                type="text"
                placeholder="Adicione uma tarefa..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="todo-button"
                type="submit"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default TodoForm;
