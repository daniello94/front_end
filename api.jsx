import axios from "axios";
const API_URL = "http://127.0.0.1:8080/";
axios.defaults.withCredentials = true;

export const newAccount = (userName, userLastName, country, phoneNumber, password, email) => {
    return axios.post(`${API_URL}newAccounted`, {
        userName: userName,
        userLastName: userLastName,
        email: email,
        phoneNumber: {
            country: country,
            number: phoneNumber
        },
        password: password,
        role: "big_boss"
    })
};

export const checkEmail = (email) => {
    return axios.post(`${API_URL}check-email`, { email })
};

export const verifyEmail = (token) => {
    return axios.get(`${API_URL}verify?token=${token}`)
};

export const loginUser = (email, password) => {
    return axios.post(`${API_URL}login`, {
        email: email,
        password: password
    })
}

export const checkSession = () => {
    return axios.get(`${API_URL}check-session`);
};

export const logOut = () => {
    return axios.post(`${API_URL}/logout`)
}