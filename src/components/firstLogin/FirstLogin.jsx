import React from "react";
import Container from "../container/Container";
import { useUser } from "../../contexts/UserContext";
import BigBoss from "./BigBoss";

const FirstLogin = () => {
    const { user } = useUser()
    return (
        <Container firstLogin={true}>
            {user && user.role === "BigBoss" && (
                <BigBoss />
            )}
            {user && (user.role === "Employee" || user.role === "Boss" || user.role === "TeamManager") && (
                <p>Zalogowany Uzytkowik normalny </p>
            )}
        </Container>
    )
}
export default FirstLogin