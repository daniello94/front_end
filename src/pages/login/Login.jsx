import React, { useState } from "react";
import styles from "./Login.module.scss";
import { RiCloseLargeLine } from "react-icons/ri";
import Container from "../../components/container/Container";
import MyButton from "../../components/button/MyButton";
import MyInput from "../../components/input/MyInput";
import { loginUser } from "../../../api";
import { useUser } from "../../contexts/UserContext";

const Login = (props) => {
    const [info, setInfo] = useState("");
    const [email, setEmail] = useState("faktury12d@gmail.com");
    const [password, setPassword] = useState("123Kolo456!");
    const [error, setError] = useState(false)
    const { setUser } = useUser();

    const sendLogin = (e) => {
        e.preventDefault();
        setInfo("Logowanie…");

        loginUser(email, password).then(response => {
            console.log("Data received:", response.data.user); 
            setUser(response.data.user); 
            props.setActiveLogin(false); 
        }).catch(err => {
            console.error("Błąd logowania:", err);
            setError(true);
            setInfo("Błąd logowania. Sprawdź dane.");
        });
    }
        return (
            <Container containerLangue={true} login={true}>
                <Container contentPages={true}>
                    <RiCloseLargeLine className={styles.offLoginViews} onClick={() => props.setActiveLogin(false)} />
                    <h1>Logowanie</h1>
                    <span className={styles.infoTextContent}>{info}</span>
                    <form className={styles.formLogin}>
                        <MyInput type="email" value={email} error={error} onChange={(e) => setEmail(e.target.value)} placeholder="Podaj Email" />
                        <MyInput type="password" value={password} error={error} onChange={(e) => setPassword(e.target.value)} placeholder="Podaj Hasło" />
                        <MyButton onClick={sendLogin} btnSubmit={true}>Zaloguj</MyButton>
                    </form>
                </Container>
            </Container>
        )
   
}
export default Login;