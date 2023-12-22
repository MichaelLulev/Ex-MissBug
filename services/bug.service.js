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

const prmBugs = _loadBugs()

function _loadBugs() {
    return fs.readFile(BUGS_PATH, 'utf-8')
        .then(res => {
            let bugs = JSON.parse(res)
            if (! bugs || bugs.length === 0) return Promise.reject('There are no bugs!')
            console.log('There are bugs! everything is OK!')
            return bugs
        })
        .catch(err => {
            console.error(err)
            console.log('Creating bugs :)')
            bugs = _createNewBugs()
            return _saveBugs(bugs).then(() => bugs)
        })
}

function _saveBugs(bugs=[]) {
    console.log('Saving bugs')
    const strBugs = JSON.stringify(bugs, null, '\t')
    return fs.stat(BUGS_DIR)
        .catch(() => fs.mkdir(BUGS_DIR))
        .then(() => fs.writeFile(BUGS_PATH, strBugs, 'utf-8'))
}

function query(filterBy, sortBy, pageInfo) {
    return prmBugs
        .then(bugs => filter(bugs, filterBy))
        .then(bugs => sort(bugs, sortBy))
        .then(bugs => getPage(bugs, pageInfo))
        .catch(err => console.error(err))
}

function filter(bugs, filterBy) {
    if (! filterBy) return bugs
    const { createdAfter, createdBefore, minSeverity, maxSeverity } = filterBy
    return bugs.filter(bug => {
        const { title, severity, description, createdAt, labels } = bug
        const text =
            filterBy.text ? RegExp(filterBy.text, 'i') : null
        const isTextInTitle =
            ! text || text.test(title)
        const isTextInDescription =
            ! text || text.test(description)
        const isTextInLabels =
            ! text || labels.some(label => text.test(label))
        const isInDateRange =
            isNaN(createdAfter) || isNaN(createdBefore) || (createdAfter <= createdAt) && (createdAt <= createdBefore)
        const isInSeverityRange =
            isNaN(minSeverity) || isNaN(maxSeverity) || (minSeverity <= severity) && (severity <= maxSeverity)
        return (isTextInTitle || isTextInDescription || isTextInLabels) && isInDateRange && isInSeverityRange
    })
}

function sort(bugs, sortBy) {
    if (! sortBy) return bugs
    const { field, isAscending } = sortBy
    if (! field || typeof isAscending !== 'boolean') return  bugs
    const dirMult = isAscending ? 1 : -1
    return bugs.sort((bug1, bug2) => {
        if (field === 'title') return bug1.title.localeCompare(bug2.title) * dirMult
        return (bug1[field] - bug2[field]) * dirMult
    })
}

function getPage(bugs, pageInfo) {
    if (! pageInfo) return bugs
    let idx = pageInfo.idx || 0
    const bugsPerPage = pageInfo.bugsPerPage || bugs.length
    const lastPage = Math.ceil(bugs.length / bugsPerPage) || 1
    const startIdx = idx * bugsPerPage
    const endIdx = startIdx + bugsPerPage
    const isLastPage = (bugs.length === 0) || lastPage <= idx + 1
    return [bugs.slice(startIdx, endIdx), isLastPage, lastPage]
}

function get(bugId) {
    return prmBugs
        .then(bugs => {
            const bug = bugs.find(bug => bug._id === bugId)
            if (! bug) return Promise.reject('No such bug')
            return bug
        })
}

function save(bug) {
    return prmBugs
        .then(bugs => {
            if (bug._id) {
                const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
                if (bugIdx < 0) return Promise.reject('No such bug')
                const origBug = bugs[bugIdx]
                for (let [key, value] of Object.entries(bug)) {
                    if (value !== undefined) origBug[key] = value
                }
                bug = origBug
            } else {
                const newBug = getNewBug()
                for (let [key, value] of Object.entries(bug)) {
                    if (value !== undefined) newBug[key] = value
                }
                newBug._id = utilService.makeId()
                newBug.createdAt = Date.now()
                bugs.unshift(newBug)
                bug = newBug
            }
            return _saveBugs(bugs).then(() => bug)
        })
}

function remove(bugId) {
    return prmBugs
        .then(bugs => {
            const bugIdx = bugs.findIndex(bug => bug._id === bugId)
            if (bugIdx < 0) return Promise.reject('No such bug')
            const bug = bugs[bugIdx]
            bugs.splice(bugIdx, 1)
            return _saveBugs(bugs).then(() => bug)
        })
        .catch(err => console.error(err) || Promise.reject(err))
}

function getNewBug() {
    const defaultBug = {
        title: "",
        severity: 0,
        description: "",
        labels: [],
    }
    return defaultBug
}

function _createNewBugs() {
    const newBugs = [
        {
            _id: "1NF1N1T3",
            title: "Infinite Loop Detected",
            severity: 4,
            description: "This bug turns the code into a never-ending story. It's like Groundhog Day, but without Bill Murray and with more screaming at the monitor.",
            labels: ["EndlessFun", "WhyMe", "TimeTravelWoes", "GroundhogDayForever"],
            createdAt: Date.now(),
        },
        {
            _id: "K3YB0RD",
            title: "Keyboard Not Found",
            severity: 3,
            description: "The computer insists there's no keyboard. We suggest trying to convince it by typing 'I swear, the keyboard is right here,' but that hasn't worked so far.",
            labels: ["MysteryTech", "WhyMe", "GhostKeyboard", "TypingIntoTheVoid"],
            createdAt: Date.now(),
        },
        {
            _id: "C0FF33",
            title: "404 Coffee Not Found",
            severity: 2,
            description: "Critical error where the developer's coffee cup is empty. Productivity drops to 0%, accompanied by mild panic and existential dread.",
            labels: ["LifeSupport", "CrisisMode", "JavaNotFound", "CaffeineCrash"],
            createdAt: Date.now(),
        },
        {
            _id: "G0053",
            title: "Unexpected Response",
            severity: 1,
            description: "The software just gave a response that was so unexpected, it might as well have been a plot twist in a soap opera. Maybe it's time to ask if it's feeling okay?",
            labels: ["TwilightZone", "WhyMe", "DramaQueenSoftware", "PlotTwistError"],
            createdAt: Date.now(),
        },
        {
            _id: "QU4NTUM",
            title: "Schrodinger's Variable",
            severity: 3,
            description: "This variable is simultaneously undefined and defined until observed. It defies logic and is contemplating a career in quantum physics.",
            labels: ["QuantumLeap", "MysteryTech", "QuantumConundrum", "HereAndNotHere"],
            createdAt: Date.now(),
        },
        {
            _id: "BR41NZ",
            title: "Zombie Processes",
            severity: 4,
            description: "These processes are dead but not really dead. They wander aimlessly through the system, occasionally groaning for CPU brains.",
            labels: ["UndeadThreads", "CrisisMode", "ZombieApocalypse"],
            createdAt: Date.now(),
        },
        {
            _id: "P03TRY",
            title: "CSS Haiku Error",
            severity: 2,
            description: "The CSS has become self-aware and is now only communicating in haikus. Beautiful, yet utterly unhelpful for layout issues.",
            labels: ["CreativeCoding", "TwilightZone", "PoeticJustice", "HaikuHavoc"],
            createdAt: Date.now(),
        },
        {
            _id: "GH05T",
            title: "The Phantom Click",
            severity: 1,
            description: "Buttons are clicking themselves. It's either a coding error or the office is haunted. The jury is still out.",
            labels: ["GhostInTheMachine", "MysteryTech", "PoltergeistProblem"],
            createdAt: Date.now(),
        },
        {
            _id: "L04D1NG",
            title: "Eternal Loading Screen",
            severity: 3,
            description: "This loading screen has been loading for so long, it's now an accepted part of the UI. Users think it's a feature.",
            labels: ["EndlessFun", "CrisisMode", "FeatureNotBug", "LoadingLimbo"],
            createdAt: Date.now(),
        },
        {
            _id: "CUR50R",
            title: "Teleporting Cursor",
            severity: 2,
            description: "The cursor randomly teleports across the screen, leading to a fun game of 'find the cursor'. It's not a bug, it's a feature!",
            labels: ["MagicTricks", "WhyMe", "CursorQuest", "MagicMouseTricks"],
            createdAt: Date.now(),
        }
    ]
    return newBugs
}