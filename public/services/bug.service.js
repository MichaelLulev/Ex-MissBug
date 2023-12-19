import axios from 'axios'

const API_BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    save,
    remove,
    create,
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
    var queryParams = ''
    queryParams += `?title=${bug.title || ''}`
    queryParams += `&severity=${bug.sevirity || 0}`
    queryParams += `&description=${bug.description || ''}`
    queryParams += `&id=${bug._id || ''}`
    const url = API_BASE_URL + 'save' + queryParams
    const prmBug = axios.get(url)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.error(err)
        })
    return prmBug
}

function remove(bugId) {
    const prmBug = axios.get(API_BASE_URL + bugId + '/remove')
        .then(res => res.data)
    return prmBug
}

function create(title='', sevirity=0, description='') {
    const newBug = {
        title,
        sevirity,
        description,
    }
    return newBug
}