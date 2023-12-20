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
        .catch(err => {
            console.error(err)
            return null
        })
        .then(res => JSON.parse(res))
}

function _saveBugs(bugs=[]) {
    console.log('saving bugs')
    const strBugs = JSON.stringify(bugs, null, '\t')
    return fs.stat(BUGS_DIR)
        .catch(() => fs.mkdir(BUGS_DIR))
        .then(() => fs.writeFile(BUGS_PATH, strBugs, 'utf-8'))
        .then(() => bugs)
}

function query(filterBy, sortBy, pageInfo) {
    return _loadBugs()
        .then(bugs => {
            if (! bugs || bugs.length === 0) {
                console.log('There are no bugs!, creating bugs :)')
                bugs = _createNewBugs()
                return _saveBugs(bugs)
            } else {
                console.log('There are bugs! everything is OK!')
                return bugs
            }
        })
        .then(bugs => filter(bugs, filterBy))
        .then(bugs => sort(bugs, sortBy))
        .then(bugs => getPage(bugs, pageInfo))
        .then(bugs => {
            console.log(bugs)
            return bugs
        })
        .catch(err => {
            console.error(err)
        })
}

function filter(bugs, filterBy) {
    console.log('filter', bugs.length)
    if (! filterBy) return bugs
    const { createdAfter, createdBefore, minSeverity, maxSeverity } = filterBy
    return bugs.filter(bug => {
        const { title, severity, description, createdAt, labels } = bug
        const text = filterBy.text ? Regex(filterBy.text, 'i') : null
        const isTextInTitle = ! text || text.test(title)
        const isTextInDescription = ! text || text.test(description)
        const isTextInLabels = ! text || labels.some(label => text.test(label))
        const isInDateRange = ! createdAfter || ! createdBefore || (createdAfter <= createdAt) && (createdAt <= createdBefore)
        const isInSeverityRange = ! minSeverity || ! maxSeverity || (minSeverity <= severity) && (severity <= maxSeverity)
        return isTextInTitle || isTextInDescription || isTextInLabels || isInDateRange || isInSeverityRange
    })
}

function sort(bugs, sortBy) {
    console.log('sort', bugs.length)
    if (! sortBy) return bugs
    const { field, direction } = sortBy
    if (! field || ! [1, -1].includes(direction)) return  bugs
    return bugs.sort((bug1, bug2) => {
        if (field === title) return bug1.title.localeCompare(bug2.title) * direction
        if (field === severity) return (bug1.severity - bug2.severity) * direction
        if (field === createdAt) return (bug1.createdAt - bug2.createdAt) * direction
    })
}

function getPage(bugs, pageInfo) {
    console.log('page', bugs.length)
    if (! pageInfo) return bugs
    const idx = pageInfo.idx || 0
    const bugsPerPage = pageInfo.bugsPerPage || 6
    const startIdx = idx * bugsPerPage
    const endIdx = startIdx + bugsPerPage
    const bugsPage = bugs.slice(startIdx, endIdx)
    console.log(startIdx, endIdx, bugsPage.length)
    return bugsPage
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
    console.log(bug)
    return query()
        .then(bugs => {
            if (bug._id) {
                const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
                console.log(bugIdx)
                if (bugIdx < 0) return Promise.reject('No such bug')
                bugs[bugIdx] = bug
            } else {
                bug._id = utilService.makeId()
                bugs.unshift(bug)
            }
            console.log(bug)
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
            _id: "1NF1N1T3",
            description: "This bug turns the code into a never-ending story. It's like Groundhog Day, but without Bill Murray and with more screaming at the monitor."
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD",
            description: "The computer insists there's no keyboard. We suggest trying to convince it by typing 'I swear, the keyboard is right here,' but that hasn't worked so far."
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33",
            description: "Critical error where the developer's coffee cup is empty. Productivity drops to 0%, accompanied by mild panic and existential dread."
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053",
            description: "The software just gave a response that was so unexpected, it might as well have been a plot twist in a soap opera. Maybe it's time to ask if it's feeling okay?"
        },
        {
            title: "Schrodinger's Variable",
            severity: 3,
            _id: "QU4NTUM",
            description: "This variable is simultaneously undefined and defined until observed. It defies logic and is contemplating a career in quantum physics."
        },
        {
            title: "Zombie Processes",
            severity: 4,
            _id: "BR41NZ",
            description: "These processes are dead but not really dead. They wander aimlessly through the system, occasionally groaning for CPU brains."
        },
        {
            title: "CSS Haiku Error",
            severity: 2,
            _id: "P03TRY",
            description: "The CSS has become self-aware and is now only communicating in haikus. Beautiful, yet utterly unhelpful for layout issues."
        },
        {
            title: "The Phantom Click",
            severity: 1,
            _id: "GH05T",
            description: "Buttons are clicking themselves. It's either a coding error or the office is haunted. The jury is still out."
        },
        {
            title: "Eternal Loading Screen",
            severity: 3,
            _id: "L04D1NG",
            description: "This loading screen has been loading for so long, it's now an accepted part of the UI. Users think it's a feature."
        },
        {
            title: "Teleporting Cursor",
            severity: 2,
            _id: "CUR50R",
            description: "The cursor randomly teleports across the screen, leading to a fun game of 'find the cursor'. It's not a bug, it's a feature!"
        }
    ]
    return newBugs
}