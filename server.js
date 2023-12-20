import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// GET all bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        text: req.query.text,
        minSeverity: req.query.minSeverity,
        maxSeverity: req.query.maxSeverity,
        createdAfter: req.query.createdAfter,
        createdBefore: req.query.createdBefore,
    }
    const sortBy = req.query.sortBy
    const pageIdx = req.query.pageIdx
    bugService.query(filterBy, sortBy, pageIdx)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.error(err)
            res.status(400).send('Cannod get bugs')
        })
})

// GET a bug
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.get(bugId)
        .then(bug => {
            let bugsVisited = req.cookies.bugsVisited || []
            bugsVisited.push(bug._id)
            bugsVisited = Array.from(new Set(bugsVisited))
            res.cookie('bugsVisited', bugsVisited, { maxAge: 60 * 1000 })
            if (3 < bugsVisited.length) return res.status(401).send('Wait for a bit')
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send(`Cannot get bug with id=${bugId}`)
        })
})

// PUT a bug
app.put('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    if (! bugId) {
        res.status(400).send(`Cannot put bug with no id`)
        return
    }
    const updatedBug = {
        _id: bugId,
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
    }
    bugService.save(updatedBug)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(`Cannot put bug with id=${req.body._id}`)
        })
})

// POST a bug
app.post('/api/bug', (req, res) => {
    const newBug = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
    }
    bugService.save(newBug)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(`Cannot post bug`)
        })
})

// DELETE a bug
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    if (! bugId) {
        res.status(400).send(`Cannot put bug with no id`)
        return
    }
    bugService.remove(bugId)
        .then(bug => {
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send(`Cannot remove bug with id=${bugId}`)
        })
})

const PORT = 3031

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))