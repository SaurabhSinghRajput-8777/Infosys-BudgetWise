import axios from 'axios';

// The base URL for your Spring Boot authentication endpoints
const API_URL = 'http://localhost:8080/api/auth/';

const register = (username, password, income, savings, targetExpenses) => {
    return axios.post(API_URL + 'register', {
        username,
        password,
        income,
        savings,
        targetExpenses
    });
};

const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password })
        .then(response => {
            // If the login is successful and a token is received,
            // store the user data (including the token) in local storage.
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    // Simply remove the user data from local storage to log them out.
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    // Retrieve the user data from local storage.
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;