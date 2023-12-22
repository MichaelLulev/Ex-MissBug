

const KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
    getNewUser,
    signup,
    login,
    getLoggedInUser,
    logout,
}

function signup(user) {
    const { username, password, fullName } = user
    return axios.post('/api/auth/signup', { username, password, fullName })
        .then(res => res.data)
        .then(user => {
            const strUser = JSON.stringify(user)
            sessionStorage.setItem(KEY_LOGGED_IN_USER, strUser)
            return user
        })
        .catch(err => console.error(err))
}

function login(user) {
    const { username, password } = user
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            const strUser = JSON.stringify(user)
            sessionStorage.setItem(KEY_LOGGED_IN_USER, strUser)
            return user
        })
        .catch(err => console.error(err))
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
        .catch(err => console.error(err))
}

function getNewUser() {
    const newUser = {
        fullName: '',
        username: '',
        password: '',
    }
    return newUser
}