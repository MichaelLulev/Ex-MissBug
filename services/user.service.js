import fs from 'fs/promises'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const USERS_DIR = './data'
const USERS_PATH = USERS_DIR + '/user.json'

const cryptr = new Cryptr(process.env.SECRET1 || 'SuperSecretKey!')

var prmUsers = _loadUsers()

export const userService = {
    query,
    save,
    checkLogin,
    getLoginToken,
    validateLoginToken,
}

function _loadUsers() {
    return fs.readFile(USERS_PATH, 'utf-8')
        .then(strUsers => JSON.parse(strUsers))
        .catch(err => console.error(err) || null)
}

function _saveUsers(users=[]) {
    console.log('Saving users')
    const strUsers = JSON.stringify(users, null, '\t')
    return fs.stat(USERS_DIR)
        .catch(() => fs.mkdir(USERS_DIR))
        .then(() => fs.writeFile(USERS_PATH, strUsers, 'utf-8'))
}

function query() {
    return prmUsers
        .then(users => {
            if (! users || users.length === 0) {
                console.log('There are no users!, creating users :)')
                users = _createNewUsers()
                return _saveUsers(users).then(() => users)
            } else {
                console.log('There are users! everything is OK!')
                return users
            }
        })
        .catch(err => console.error(err))
}

function save(user) {
    return query()
        .then(users => {
            let newUser = getNewUser()
            for (let key in newUser) {
                if (user[key]) newUser[key] = user[key]
            }
            newUser._id = utilService.makeId()
            newUser.createdAt = Date.now()
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
        createdAt: NaN,
        isAdmin: false,
    }
    return newUser
}

function _createNewUsers() {
    const newUsers = [
        {
            fullName: 'John Dough',
            username: 'breadman',
            password: 'flourPower123',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            fullName: 'Sally Sizzle',
            username: 'pancakeQueen',
            password: 'SyrupLover99',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            fullName: 'Mike Rover',
            username: 'spaceCadet',
            password: 'MarsIsMyHome!2023',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
            fullName: 'Fiona Feline',
            username: 'catWhisperer',
            password: 'PurrPurrMeow',
            createdAt: Date.now(),
            isAdmin: false,
        },
        {
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
    return query()
        .then(users => {
            let user = users.find(user => user.username === username)
            if (! user) return Promise.reject(`No such user '${username}'`)
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
    const strUser = cryptr.decrypt(loginToken)
    const user = JSON.parse(strUser)
    return user
}