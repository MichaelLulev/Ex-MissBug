import fs from 'fs/promises'
import { utilService } from './util.service.js'

const BUGS_DIR = './data'
const BUGS_PATH = `${BUGS_DIR}/bugs.json`

export const bugService = {
    query,
    get,
    save,
    remove,
}

function _loadBugs() {
    return fs.readFile(BUGS_PATH, 'utf-8')
        .then(res => JSON.parse(res))
}

function _saveBugs(bugs=[]) {
    const strBugs = JSON.stringify(bugs, null, '\t')
    return fs.stat(BUGS_DIR)
        .catch(() => fs.mkdir(BUGS_DIR))
        .then(() => fs.writeFile(BUGS_PATH, strBugs, 'utf-8'))
}

function query() {
    return _loadBugs()
        .then(bugs => {
            if (! bugs || bugs.length === 0) {
                console.log('There are no bugs!, creating bugs :)')
                bugs = _createNewBugs()
                return _saveBugs(bugs).then(() => bugs)
            } else {
                console.log('There are bugs! everything is OK!')
                return bugs
            }
        })
}

function get(bugId) {
    return query()
        .then(bugs => {
            const bug = bugs.find(bug => bug._id === bugId)
            if (! bug) return Promise.reject('No such bug')
            return bug
        })
}

function save(bug) {
    return query()
        .then(bugs => {
            if (bug._id) {
                const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
                if (bugIdx < 0) return Promise.reject('No such bug')
                bugs[bugIdx] = bug
            } else {
                bug._id = utilService.makeId()
                bugs.unshift(bug)
            }
            return _saveBugs(bugs).then(() => bug)
        })
}

function remove(bugId) {
    return query()
        .then(bugs => {
            const bugIdx = bugs.findIndex(bug => bug._id === bugId)
            if (bugIdx < 0) return Promise.reject('No such bug')
            const bug = bugs[bugIdx]
            bugs.splice(bugIdx, 1)
            return _saveBugs(bugs).then(() => bug)
        })
}

function _createNewBugs() {
    const newBugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053"
        }
    ]
    return newBugs
}
