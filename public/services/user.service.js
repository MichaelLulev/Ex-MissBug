

const KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
    getNewUser,
    signup,
    login,
    getLoggedInUser,
    logout,
}

function signup(user) {
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            const strUser = JSON.stringify(user)
            sessionStorage.setItem(KEY_LOGGED_IN_USER, strUser)
            return user
        })
        .catch(({ response }) => console.error(response.data))
}

function login(user) {
    return axios.post('/api/auth/login', user)
        .then(res => res.data)
        .then(user => {
            const strUser = JSON.stringify(user)
            sessionStorage.setItem(KEY_LOGGED_IN_USER, strUser)
            return user
        })
        .catch(({ response }) => console.error(response.data))
}

function getLoggedInUser() {
    const strLoggedInUser = sessionStorage.getItem(KEY_LOGGED_IN_USER)
    const loggedInUser = JSON.parse(strLoggedInUser)
    return loggedInUser
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(KEY_LOGGED_IN_USER)
        })
        .catch(({ response }) => console.error(response.data))
}

function getNewUser() {
    const newUser = {
        fullName: '',
        username: '',
        password: '',
    }
    return newUser
}