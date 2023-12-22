import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const USERS_DIR = './data'
const USERS_PATH = USERS_DIR + '/user.json'

const cryptr = new Cryptr(process.env.SECRET1 || 'SuperSecretKey!')

export const userService = {
    query,
    save,
    getNewUser,
    checkLogin,
    getLoginToken,
    validateLoginToken,
}

const prmUsers = _loadUsers()

function _loadUsers() {
    return utilService.loadFromFile(USERS_DIR, USERS_PATH, _createNewUsers)
}

function _saveUsers() {
    return prmUsers
        .then(users => utilService.saveToFile(USERS_DIR, USERS_PATH, users))
}

function query() {
    return prmUsers
        .then(users => {
            if (! users || users.length === 0) {
                console.log('There are no users!, creating users :)')
                users = _createNewUsers()
                return _saveUsers(users).then(() => users)
            }
            return users
        })
        .catch(err => console.error(err))
}

function save(user) {
    return prmUsers
        .then(users => {
            if (users.find(_user => _user.username === user.username)) {
                return Promise.reject('User already exsists')
            }
            let newUser = getNewUser()
            for (let key in newUser) {
                if (user[key]) newUser[key] = user[key]
                else return Promise.reject('Missing ' + key)
            }
            newUser._id = utilService.makeId()
            newUser.createdAt = Date.now()
            newUser.isAdmin = false
            users.unshift(newUser)
            user = { ...newUser }
            delete user.password
            return _saveUsers(users).then(() => user)
        })
        .catch(err => console.log(err) || Promise.reject(err))
}

function getNewUser() {
    const newUser = {
        fullName: '',
        username: '',
        password: '',
    }
    return newUser
}

function _createNewUsers() {
    const newUsers = [
        {
            _id: 'doughy-delights-123',
            fullName: 'John Dough',
            username: 'breadman',
            password: 'flourPower123',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            _id: 'syrupy-skills-456',
            fullName: 'Sally Sizzle',
            username: 'pancakeQueen',
            password: 'SyrupLover99',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            _id: 'mars-maverick-789',
            fullName: 'Mike Rover',
            username: 'spaceCadet',
            password: 'MarsIsMyHome!2023',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            _id: 'purrfect-pal-101',
            fullName: 'Fiona Feline',
            username: 'catWhisperer',
            password: 'PurrPurrMeow',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            _id: 'byte-boss-202',
            fullName: 'Gary Gigabyte',
            username: 'adminGuru',
            password: 'SuperSecure!2023',
            createdAt: Date.now(),
            isAdmin: true,
        }
    ]
    return newUsers
}

function checkLogin({ username, password}) {
    return prmUsers
        .then(users => {
            let user = users.find(user => user.username === username)
            if (! user) return Promise.reject(`No such username '${username}'`)
            if (user.password !== password) return Promise.reject('Wrong password!')
            user = { ...user }
            delete user.password
            return user
        })
}

function getLoginToken(user) {
    const strUser = JSON.stringify(user)
    const loginToken = cryptr.encrypt(strUser)
    return loginToken
}

function validateLoginToken(loginToken) {
    try {
        const strUser = cryptr.decrypt(loginToken)
        var user = JSON.parse(strUser)
    } catch (err) {
        console.error(err)
        var user = null
    }
    return user
}