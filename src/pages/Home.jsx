import React from 'react';
import { useUser } from '../contexts/UserContext';

const Home = () => {
    const { user } = useUser();

    return (
        <div className='container'>
            <h1>{user ? `Witaj, ${user.role}!` : 'Nie jesteś zalogowany'}</h1>
            <p>...inne treści...</p>
        </div>
    );
};

export default Home;
