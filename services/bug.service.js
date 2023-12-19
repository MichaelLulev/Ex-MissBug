import fs from 'fs/promises'
import { utilService } from './util.service.js'

const BUGS_DIR = './data'
const BUGS_PATH = `${BUGS_DIR}/bugs.json`

_createBugs()

export const bugService = {
    query,
    get,
    save,
    remove,
    create,
}

function _getBugs() {
    const prmBugs = fs.readFile(BUGS_PATH, 'utf-8')
        .then(res => JSON.parse(res))
    return prmBugs
}

function _saveBugs(bugs=[]) {
    const strBugs = JSON.stringify(bugs, null, '\t')
    const prm = fs.stat(BUGS_DIR)
        .catch(() => fs.mkdir(BUGS_DIR))
        .then(() => fs.writeFile(BUGS_PATH, strBugs, 'utf-8'))
    return prm
}

function query() {
    const prmBugs = _getBugs()
        .then(bugs => {
            if (! bugs || ! bugs.length) {
                console.log('There are no bugs!, creating bugs :)')
                bugs = _createBugs()
                var prmBugs = _saveBugs(bugs)
                    .then(() => bugs)
            } else {
                console.log('There are bugs! everything is OK!')
                var prmBugs = Promise.resolve(bugs)
            }
            return prmBugs
        })
    return prmBugs
}
function get(bugId) {
    const prmBug = query()
        .then(bugs => {
            const bug = bugs.find(bug => bug._id === bugId)
            if (! bug) return Promise.reject('No such bug')
            return bug
        })
    return prmBug
}

function save(bug) {
    const prm = query()
        .then(bugs => {
            if (bug._id) {
                const bugIdx = bugs.findIndex(_bug => {
                    return _bug._id === bug._id
                })
                if (bugIdx < 0) return Promise.reject('No such bug')
                bugs[bugIdx] = bug
        } else {
                bug = create(bug.title, bug.severity, bug.description)
                bug._id = utilService.makeId()
                bugs.push(bug)
            }
            const prmBug = _saveBugs(bugs)
                .then(() => bug)
            return prmBug
        })
    return prm
}

function remove(bugId) {
    const prmBug =
    query()
        .then(bugs => {
            const bugIdx = bugs.findIndex(bug => bug._id === bugId)
            if (bugIdx < 0) return Promise.reject('No such bug')
            const bug = bugs[bugIdx]
            bugs.splice(bugIdx, 1)
            const prmBug = _saveBugs(bugs)
                .then(() => bug)
            return prmBug
        })
    return prmBug
}

function create(title='', severity, description='', _id) {
    if (isNaN(severity)) severity = 0
    const newBug = {
        title,
        severity,
        description,
        _id,
    }
    return newBug
}

function _createBugs() {
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
