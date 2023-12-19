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
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.error(err)
            res.status(400).send('Cannod get bugs')
        })
})

// PUT a bug
app.put('/api/bug', (req, res) => {
    const updatedBug = {
        _id: req.body._id,
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
            res.status(400).send(`Cannot put bug id=${req.body._id}`)
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

// GET a bug
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.get(bugId)
        .then(bug => {
            let bugsVisited = req.cookies.bugsVisited || []
            bugsVisited.push(bug._id)
            bugsVisited = Array.from(new Set(bugsVisited))
            console.log(bugsVisited)
            res.cookie('bugsVisited', bugsVisited, { maxAge: 7 * 1000 })
            if (3 < bugsVisited.length) return res.status(401).send('Wait for a bit')
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send(`Cannot get bug id=${bugId}`)
        })
})

// DELETE a bug
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(bug => {
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send(`Cannot remove bug id=${bugId}`)
        })
})

app.listen(3030, () => console.log('Server ready at port 3030'))