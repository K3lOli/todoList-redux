import styles from "./card.module.scss";
import Select from "./components/tasks";
import TodoForm from "../Home";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../store/reducers/toggleReducer";
import { auth } from "../../services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { fetchTasks, resetTodo } from "../../store/reducers/todoReducer";
import { AnyAction } from "@reduxjs/toolkit";

export default function Card() {
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [logado, setLogado] = useState(false);
  const [usuarioCurrent, setUsuarioCurrent] = useState<User | null>(null);

  const toogleModal = useSelector((state: any) => state.toggle);
  const dispatch = useDispatch();

  function getUserTasksRef(user: User | null) {
    if (user) {
      return user.uid;
    }
    return null;
  }

  const authenticator = () => {
    console.log("entrou");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const userTasksRef = getUserTasksRef(result.user);
        dispatch(fetchTasks(userTasksRef) as unknown as AnyAction);
        setLogado(true);
        setUsuarioCurrent(auth.currentUser);
      })
      .catch((error) => {
        console.log("deu errado", error);
      });
  };

  function checkAuthStatus() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      // O usuário está autenticado, use as informações do usuário
      console.log('Usuário autenticado:', user);
    } else {
      // O usuário não está autenticado
      console.log('Usuário não autenticado');
    }
  }

  window.addEventListener('load', () => {
    checkAuthStatus();
  });

  function logout() {
    auth
      .signOut()
      .then(() => {
        // Logout bem-sucedido
        setLogado(false);
        dispatch(resetTodo());
        console.log("Logout realizado com sucesso.");
      })
      .catch((error) => {
        // Trate qualquer erro que possa ocorrer durante o logout
        console.error("Erro ao fazer logout:", error);
      });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const data = new Date();
      const dia = data.getDate();
      const mes = format(data, "MMM", { locale: ptBR });
      const ano = data.getFullYear();
      const diaSemana = format(data, "EEE", { locale: ptBR });

      const diaFormatado = dia < 10 ? `0${dia}` : dia;

      setAno(`${ano}`);
      setMes(mes);
      setDia(`${diaFormatado}`);
      setDiaSemana(diaSemana);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <main className={styles.main}>
        <header className={styles.main__card}>
          <div className={styles.main__card__body}>
            <div className={styles.main__card__body__relative}>
              <button onClick={authenticator}>LogIn</button>
              <button onClick={logout}>LogOut</button>
            </div>
            {logado ? (
              <div className={styles.main__card__body__head}>
                {" "}
                <div className={styles.main__card__body__head__img}>
                  <img
                    className={styles.img}
                    src={`${usuarioCurrent?.photoURL}`}
                    alt=""
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "30px",
                  }}
                >
                  <h1
                    className={styles.h1}
                  >{`Hey, ${usuarioCurrent?.displayName}!`}</h1>
                  <p style={{ fontSize: 16 }}>What do you have to do?</p>
                </div>
              </div>
            ) : (
              <div className={styles.main__card__body__head}>
                {" "}
                <div className={styles.main__card__body__head__img}></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <h1 className={styles.h1}>{`Hey!`}</h1>
                  <p style={{ fontSize: 16 }}>What do you have to do?</p>
                </div>
              </div>
            )}

            <Select />
          </div>
          <div className={styles.main__card__body__time}>
            <div
              className={styles.main__card__body__time__visible}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  color: "white",
                }}
              >
                {dia}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  textAlign: "end",
                  width: "min-content",
                }}
              >
                <h1
                  style={{
                    fontSize: "1rem",
                    color: "white",
                    textAlign: "end",
                  }}
                >
                  {mes}
                </h1>
                <h1
                  style={{
                    fontSize: "1rem",
                    color: "white",
                    textAlign: "end",
                  }}
                >
                  {ano}
                </h1>
              </div>
              <h1
                style={{
                  fontSize: "1.3rem",
                  color: "white",
                }}
              >
                {diaSemana}
              </h1>
            </div>
            <div className={styles.main__card__body__time__plus
            }>
              <button
                className={styles.main__card__body__time__add}
                onClick={() => dispatch(toggle())}
              >
                <AiOutlinePlus size={30} color="black" />
              </button>
            </div>
          </div>
        </header>
      </main>
      <div style={toogleModal ? {} : { display: "none" }}>
        <TodoForm />
      </div>
    </div>
  );
}
