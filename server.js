import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'


const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => res.status(400).send('Cannod get bugs'))
})

app.get('/api/bug/save', (req, res) => {
    const title = req.query.title
    const severity = +req.query.severity
    const description = req.query.description
    const _id = req.query.id
    const newBug = bugService.create(title, severity, description, _id)
    bugService.save(newBug)
        .then(bug => res.send(bug))
        .catch(err => {
            console.error(err)
            return res.status(400).send('Cannot save bug ' + _id)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.get(bugId)
        .then(bug => {
            let bugsVisited = req.cookies.bugsVisited || '[]'
            bugsVisited = JSON.parse(bugsVisited)
            bugsVisited.push(bug._id)
            bugsVisited = Array.from(new Set(bugsVisited))
            const strBugsVisited = JSON.stringify(bugsVisited)
            console.log(strBugsVisited)
            res.cookie('bugsVisited', strBugsVisited, { maxAge: 7 * 1000 })
            if (3 < bugsVisited.length) return res.status(401).send('Wait for a bit')
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send('Cannot get bug ' + bugId)
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(bug => {
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send('Cannot remove bug ' + bugId)
        })
})

app.listen(3030, () => console.log('Server ready at port 3030'))