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
    return utilService.loadFromFile(BUGS_DIR, BUGS_PATH, _createNewBugs)
}

function _saveBugs() {
    return prmBugs
        .then(bugs => utilService.saveToFile(BUGS_DIR, BUGS_PATH, bugs))
}

function query(filterBy, sortBy, pageInfo) {
    return prmBugs
        .then(bugs => {
            if (! bugs || bugs.length === 0) {
                console.log('There are no bugs! Creating bugs :)')
                bugs = _createNewBugs()
                return _saveBugs(bugs).then(() => bugs)
            }
            return bugs
        })
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

function save(bug, loggedInUser) {
    return prmBugs
        .then(bugs => {
            if (bug._id) {
                const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
                if (bugIdx < 0) return Promise.reject('No such bug')
                const origBug = bugs[bugIdx]
                console.log('bug', bug)
                console.log('origBug', origBug)
                console.log('loggedInUser', loggedInUser)
                if (! loggedInUser.isAdmin && origBug.creator._id !== loggedInUser._id) {
                    return Promise.reject('Not your bug!')
                }
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
                newBug.creator = loggedInUser
                bugs.unshift(newBug)
                bug = newBug
            }
            return _saveBugs(bugs).then(() => bug)
        })
}

function remove(bugId, loggedInUser) {
    return prmBugs
        .then(bugs => {
            const bugIdx = bugs.findIndex(bug => bug._id === bugId)
            if (bugIdx < 0) return Promise.reject('No such bug')
            const bug = bugs[bugIdx]
            if (! loggedInUser.isAdmin && bug.creator._id !== loggedInUser._id) {
                return Promise.reject('Not your bug!')
            }
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
        creator: null,
    }
    return defaultBug
}

function _createNewBugs() {
    const newBugs = [
        {
            _id: "1NF1N1T3",
            title: "Infinite Loop Detected",
            severity: 4,
            description: "This bug turns the code into a never-ending story...",
            labels: ["EndlessFun", "WhyMe", "TimeTravelWoes", "GroundhogDayForever"],
            createdAt: Date.now(),
            creator: {
                _id: 'doughy-delights-123',
                fullName: 'John Dough',
                username: 'breadman',
                isAdmin: false,
            }
        },
        {
            _id: "K3YB0RD",
            title: "Keyboard Not Found",
            severity: 3,
            description: "The computer insists there's no keyboard...",
            labels: ["MysteryTech", "WhyMe", "GhostKeyboard", "TypingIntoTheVoid"],
            createdAt: Date.now(),
            creator: {
                _id: 'syrupy-skills-456',
                fullName: 'Sally Sizzle',
                username: 'pancakeQueen',
                isAdmin: false,
            }
        },
        {
            _id: "C0FF33",
            title: "404 Coffee Not Found",
            severity: 2,
            description: "Critical error where the developer's coffee cup is empty...",
            labels: ["LifeSupport", "CrisisMode", "JavaNotFound", "CaffeineCrash"],
            createdAt: Date.now(),
            creator: {
                _id: 'mars-maverick-789',
                fullName: 'Mike Rover',
                username: 'spaceCadet',
                isAdmin: false,
            }
        },
        {
            _id: "G0053",
            title: "Unexpected Response",
            severity: 1,
            description: "The software just gave a response that was so unexpected...",
            labels: ["TwilightZone", "WhyMe", "DramaQueenSoftware", "PlotTwistError"],
            createdAt: Date.now(),
            creator: {
                _id: 'purrfect-pal-101',
                fullName: 'Fiona Feline',
                username: 'catWhisperer',
                isAdmin: false,
            }
        },
        {
            _id: "QU4NTUM",
            title: "Schrodinger's Variable",
            severity: 3,
            description: "This variable is simultaneously undefined and defined until observed...",
            labels: ["QuantumLeap", "MysteryTech", "QuantumConundrum", "HereAndNotHere"],
            createdAt: Date.now(),
            creator: {
                _id: 'byte-boss-202',
                fullName: 'Gary Gigabyte',
                username: 'adminGuru',
                isAdmin: true,
            }
        },
        {
            _id: "BR41NZ",
            title: "Zombie Processes",
            severity: 4,
            description: "These processes are dead but not really dead...",
            labels: ["UndeadThreads", "CrisisMode", "ZombieApocalypse"],
            createdAt: Date.now(),
            creator: {
                _id: 'doughy-delights-123',
                fullName: 'John Dough',
                username: 'breadman',
                isAdmin: false,
            }
        },
        {
            _id: "P03TRY",
            title: "CSS Haiku Error",
            severity: 2,
            description: "The CSS has become self-aware and is now only communicating in haikus...",
            labels: ["CreativeCoding", "TwilightZone", "PoeticJustice", "HaikuHavoc"],
            createdAt: Date.now(),
            creator: {
                _id: 'syrupy-skills-456',
                fullName: 'Sally Sizzle',
                username: 'pancakeQueen',
                isAdmin: false,
            }
        },
        {
            _id: "GH05T",
            title: "The Phantom Click",
            severity: 1,
            description: "Buttons are clicking themselves...",
            labels: ["GhostInTheMachine", "MysteryTech", "PoltergeistProblem"],
            createdAt: Date.now(),
            creator: {
                _id: 'mars-maverick-789',
                fullName: 'Mike Rover',
                username: 'spaceCadet',
                isAdmin: false,
            }
        },
        {
            _id: "L04D1NG",
            title: "Eternal Loading Screen",
            severity: 3,
            description: "This loading screen has been loading for so long...",
            labels: ["EndlessFun", "CrisisMode", "FeatureNotBug", "LoadingLimbo"],
            createdAt: Date.now(),
            creator: {
                _id: 'purrfect-pal-101',
                fullName: 'Fiona Feline',
                username: 'catWhisperer',
                isAdmin: false,
            }
        },
        {
            _id: "CUR50R",
            title: "Teleporting Cursor",
            severity: 2,
            description: "The cursor randomly teleports across the screen...",
            labels: ["MagicTricks", "WhyMe", "CursorQuest", "MagicMouseTricks"],
            createdAt: Date.now(),
            creator: {
                _id: 'byte-boss-202',
                fullName: 'Gary Gigabyte',
                username: 'adminGuru',
                isAdmin: true,
            }
        }
    ]    
    return newBugs
}