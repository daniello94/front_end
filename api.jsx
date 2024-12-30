import axios from "axios";
const API_URL = "http://127.0.0.1:8080/";

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
}