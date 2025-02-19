import React from 'react';
import { useUser } from '../contexts/UserContext';
import Container from '../components/container/Container';
import ProfileUser from './ProfileUser/ProfileUser';
import Company from './Company/Company';
import Project from './Project/Project';
import Employs from './Employs/Employs';
import Message from './Message/Message';
import Shop from './Shop/Shop';
import Schedule from './Schedule/Schedule'


const Home = ({ selectedItem }) => {
    const { user } = useUser();

    return (
        <Container>
            {selectedItem === "none" && (
                <h1>{user ? `Witaj, ${user?.userName}!` : 'Nie jesteś zalogowany'}</h1>
            )}
            {selectedItem === "profileUser" && (
                <ProfileUser />
            )}   {selectedItem === "company" && (
                <Company />
            )}   {selectedItem === "project" && (
                <Project />
            )}   {selectedItem === "employs" && (
                <Employs />
            )}   {selectedItem === "message" && (
                <Message />
            )}   {selectedItem === "shop" && (
                <Shop />
            )}   {selectedItem === "schedule" && (
                <Schedule />
            )}


        </Container>
    );
};

export default Home;
