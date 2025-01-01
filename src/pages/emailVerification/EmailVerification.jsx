import React, { useEffect, useState } from 'react';
import Container from '../../components/container/Container';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { verifyEmail } from '../../../api';

const EmailVerification = () => {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const { t } = useTranslation("VerificationAccount");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
            verifyEmail(token).then(response => {
                setStatus(t("statusCorrect"));
            }).catch(err => {
                console.error('Axios Error:', err);
                setStatus(t('statusError'));
                setError(t('error'));
            });
        } else {
            setStatus(t('statusToken'));
        }
    }, [location]);

    return (
        <Container>
            <h1>{t('h1')} {status}</h1>
            {error && <p>{t('p')} {error}</p>}
        </Container>
    );
};

export default EmailVerification;
