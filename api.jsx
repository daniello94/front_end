import axios from "axios";
const API_URL = "http://127.0.0.1:8080/";
// axios.defaults.withCredentials = true;

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
    },
        { withCredentials: true })
}

export const checkSession = async () => {
    return axios.get(`${API_URL}check-session`, {
        withCredentials: true
    });
};

export const logoutUser = async () => {
    return axios.post(`${API_URL}logout`, {}, {
        withCredentials: true
    });
};

export const refreshToken = async () => {
    return axios.get(`${API_URL}refresh-token`, { withCredentials: true });
};