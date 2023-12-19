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
        .then(res => res.data)
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
    var queryParams
    queryParams += `?title=${bug.title}`
    queryParams += `&severity=${bug.sevirity}`
    queryParams += `&description=${bug.description}`
    queryParams += `&id=${bug._id}`
    const prmBug = axios.get(API_BASE_URL + '/save' + queryParams)
        .then(res => res.data)
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