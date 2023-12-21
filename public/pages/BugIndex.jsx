import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { Filter } from '../cmps/Filter.jsx'
import { Sort } from '../cmps/Sort.jsx'
import { Page } from '../cmps/Page.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilterBy())
    const [sortBy, setSortBy] = useState(bugService.getDefaultSortBy())
    const [pageInfo, setPageInfo] = useState(bugService.getDefaultPageInfo())
    const [isLastPage, setIsLastPage] = useState(false)

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy, pageInfo])

    function loadBugs() {
        bugService.query(filterBy, sortBy, pageInfo)
            .then(([bugs, newIsLastPage, lastPage]) => {
                setBugs(bugs)
                setIsLastPage(newIsLastPage)
                if (newIsLastPage && lastPage - 1 < pageInfo.idx) onSetPageInfo({ idx: lastPage - 1 })
            })
            .catch(err => {
                console.log(err)
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title'),
            severity: +prompt('Bug severity'),
            description: prompt('Bug description'),
            labels: [],
        }
        do {
            labels.push(prompt('Add a label'))
        } while (label)
        labels.pop()
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                if (bugs.length === 0) {
                    loadBugs()
                } else {
                    setBugs([...bugs, savedBug])
                }
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const title = propmt('New title', bug.title) || bug.title
        const severityInput = +prompt('New severity', bug.severity)
        const severity = isNaN(severityInput) ? bug.severity : severityInput
        const description = prompt('New descripiton', bug.description) || bug.description
        const bugToSave = { ...bug, title, severity, description }
        bugService
            .save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(bug => {
                    return bug._id === savedBug._id ? savedBug : bug
                })
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetFilterBy(newFilterBy) {
        setFilterBy(prev => ({ ...prev, ...newFilterBy}))
    }

    function onSetSortBy(newSortBy) {
        setSortBy(prev => ({ ...prev, ...newSortBy}))
    }

    function onSetPageInfo(newPageInfo) {
        setPageInfo(prev => ({ ...prev, ...newPageInfo}))
    }

    return (
        <main>
            <h2>Bugs App</h2>
            <main>
                <Filter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <Sort sortBy={sortBy} onSetSortBy={onSetSortBy} />
                <Page pageInfo={pageInfo} onSetPageInfo={onSetPageInfo} isLastPage={isLastPage} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <Page pageInfo={pageInfo} onSetPageInfo={onSetPageInfo} isLastPage={isLastPage} />
            </main>
        </main>
    )
}
