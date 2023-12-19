import fs from 'fs/promises'

const BUGS_DIR = './data'
const BUGS_PATH = `${BUGS_DIR}/bugs.json`

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}

function _getBugs() {
    const prmBugs = fs.readFile(BUGS_PATH, 'utf-8')
        .then(res => JSON.parse(res))
        .catch(err => console.error('Can\'t read bugs file'))
    return prmBugs
}

function _saveBugs(bugs=[]) {
    const strBugs = JSON.stringify(bugs, null, '\t')
    const prm = fs.stat(BUGS_DIR)
        .catch(() => fs.mkdir(BUGS_DIR))
        .then(() => fs.writeFile(BUGS_PATH, strBugs, 'utf-8'))
        .catch(err => console.error(err))
    return prm
}

function query() {
    const prmBugs = _getBugs()
    return prmBugs
}
function getById(bugId) {
    const prmBug = query()
        .then(bugs => {
            return bugs.find(bug => bug._id === bugId)
        })
        .catch(err => console.error(err))
    return prmBug
}

function remove(bugId) {
    const prm = query()
        .then(bugs => {
            const newBugs = bugs.filter(bug => bug._id !== bugId)
            const prm = _saveBugs(newBugs)
            return prm
        })
        .catch(err => console.error(err))
    return prm
}

function save(bug) {
    query()
        .then(bugs => {
            let prm
            if (bug._id) {
                const bugIdx = bugs.findIdx(_bug => _bug._id === bug._id)
                bugs[bugIdx] = bug
            } else {
                bugs.push(bug)
            }
            prm = _saveBugs(bugs)
            return prm
        })
        .catch(err => console.error(err))
}




function _createBugs() {
    const prm = _getBugs()
        .then(bugs => {
            if (! bugs || ! bugs.length) {
                console.log('There are no bugs!, creating bugs :)')
                bugs = [
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
                return _saveBugs(bugs)
            } else {
                console.log('There are bugs! everything is OK!')
            }
        })
        .catch(err => console.error(err))
    return prm
}
