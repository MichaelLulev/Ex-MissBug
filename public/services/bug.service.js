import axios from 'axios'

const API_BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    save,
    remove,
}

function query() {
    const prmBugs = axios.get(API_BASE_URL)
        .then(res => {
            return res.data
        })
        .then(bugs => {
            return bugs
        })
    return prmBugs
}

function get(bugId) {
    const prmBug = axios.get(API_BASE_URL + bugId)
        .then(res => res.data)
    return prmBug
}

function save(bug) {
    console.log('saving bug!')
    const saveFunc = bug._id ? axios.put : axios.post
    return saveFunc(API_BASE_URL, bug)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.error(err)
        })
}

function remove(bugId) {
    return axios.delete(API_BASE_URL + bugId)
        .then(res => {
            return res.data
        })
}
