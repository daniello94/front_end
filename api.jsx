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

export const userInfo = async (userId) => {
    return axios.get(`${API_URL}user-info/${userId}`, { withCredentials: true })
}

export const updateUser = async (userId, updatedData) => {
    return axios.put(`${API_URL}users/${userId}`, updatedData, {
        withCredentials: true
    })
};

export const updatePhoneNumber = (userId, country, phoneNumber) => {
    return axios.patch(`${API_URL}update-phone/${userId}`,
        {
            phoneNumber: {
                country: country,
                number: phoneNumber
            }
        },
        { withCredentials: true }
    );
};

export const newCompany = async (data) => {
    return axios.post(
        `${API_URL}company/newCompany`,
        {
            nameCompany: data.nameCompany,
            country: data.country,
            identificationNumber: data.identificationNumber,
            address: {
                city: data.city,
                street: data.street,
                number: data.number,
                numberBox: data.numberBox,
                zipCode: data.zipCode,
            },
            email: data.email,
            bigBossEmail: data.bigBossEmail
        },
        { withCredentials: true }
    );
};

export const removeFirstLogin = async (userId) => {
    return axios.patch(`${API_URL}firstLoginRemove/${userId}`, { withCredentials: true })
}

export const addEmployee = async (data) => {
    return axios.post(`${API_URL}users`, {
        userName: data.userName,
        userLastName: data.userLastName,
        email: data.email,
        price: data.price,
        role: data.role,
        bigBossEmail: data.bigBossEmail
    }, { withCredentials: true })
};

export const listEmployeeCompany = async (companyId) => {
    return axios.get(`${API_URL}company/employeeList/${companyId}`, { withCredentials: true })
};

export const userToggleStatus = async (userId) => {
    return axios.patch(`${API_URL}user-toggle-status/${userId}`, {}, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const deleteUsers = async (userId) => {
    return axios.delete(`${API_URL}users/${userId}`, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const changeRole = async (newRole, userId) => {
    return axios.post(`${API_URL}change-role/${userId}`, { newRole }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const viewsUsersSort = async (role, companyId) => {
    return axios.get(`${API_URL}users-role`, {
        params: { role, companyId },
        withCredentials: true,
    });
};