import React from "react";
import Container from "../container/Container";
import { useUser } from "../../contexts/UserContext";

const FirstLogin = () => {
    const { user } = useUser()
    return (
        <Container containerLangue={true}>
            {user && user.role === "BigBoss" && (
                <p>Zalogowany Uzytkownik o roli BigBoss</p>
            )}
            {user && (user.role === "Employee" || user.role === "Boss" || user.role === "TeamManager") && (
                <p>Zalogowany Uzytkowik normalny </p>
            )}
        </Container>
    )
}
export default FirstLogin