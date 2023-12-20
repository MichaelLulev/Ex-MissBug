import axios from 'axios'

const API_BASE_URL = '/api/bug/'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

export const bugService = {
    query,
    get,
    save,
    remove,
    getDefaultFilterBy,
    getDefaultSortBy,
}

function query(filterBy={}, sortBy={}, pageInfo={}) {
    const prmBugs = axios.get(API_BASE_URL, { params: { ...filterBy, ...sortBy, ...pageInfo } })
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

function getDefaultFilterBy() {
    const defaultFitlerBy = {
        text: '',
        createdAfter: Date.now() - WEEK,
        createdBefore: Date.now() + WEEK,
        minSeverity: 0,
        maxSeverity: 5,
    }
    return defaultFitlerBy
}

function getDefaultSortBy() {
    const defaultSortBy = {
        field: 'title',
        isAscending: false,
    }
    return defaultSortBy
}