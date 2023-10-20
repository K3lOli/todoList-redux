import styles from "./card.module.scss";
import Select from "./components/tasks";
import TodoForm from "../Home";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../store/reducers/toggleReducer";
import {auth} from "../../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fetchTasks } from "../../store/reducers/todoReducer";
import { AnyAction } from "@reduxjs/toolkit";

export default function Card() {
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [diaSemana, setDiaSemana] = useState("");

  const toogleModal = useSelector((state: any) => state.toggle);
  const dispatch = useDispatch();

  const authenticator = () => {
    console.log("entrou");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        dispatch(fetchTasks() as unknown as AnyAction);
      })
      .catch((error) => {
        console.log("deu errado", error);
      });
  };

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
            <div className={styles.main__card__body__head}>
              <div className={styles.main__card__body__head__img} onClick={authenticator}></div>
              <h1 className={styles.h1}>Usuário</h1>
            </div>
            <Select />
          </div>
          <div className={styles.main__card__time}>
            <div>
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
                  flexDirection: "row",
                  gap: "0.5rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "1rem",
                    color: "white",
                  }}
                >
                  {mes}
                </h1>
                <h1
                  style={{
                    fontSize: "1rem",
                    color: "white",
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
            <button
              className={styles.main__card__time__add}
              onClick={() => dispatch(toggle())}
            >
              <AiOutlinePlus size={30} color="black" />
            </button>
          </div>
        </header>
      </main>
      <div style={toogleModal ? {} : { display: "none" }}>
        <TodoForm />
      </div>
    </div>
  );
}
