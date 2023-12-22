import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// Bug
// Get all bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        text: req.query.text,
        minSeverity: +req.query.minSeverity,
        maxSeverity: +req.query.maxSeverity,
        createdAfter: +req.query.createdAfter,
        createdBefore: +req.query.createdBefore,
    }
    const sortBy = {
        field: req.query.field,
        isAscending: req.query.isAscending === 'true',
    }
    const pageInfo = {
        idx: +req.query.idx,
        bugsPerPage: +req.query.bugsPerPage,
    }
    bugService.query(filterBy, sortBy, pageInfo)
        .then(([bugs, isLastPage, lastPage]) => res.send([bugs, isLastPage, lastPage]))
        .catch(err => {
            console.error(err)
            res.status(400).send('Cannod get bugs')
        })
})

// Get one bug
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    bugService.get(bugId)
        .then(bug => {
            if (! loggedInUser) {
                let bugsVisited = req.cookies.bugsVisited || []
                bugsVisited.push(bug._id)
                bugsVisited = Array.from(new Set(bugsVisited))
                res.cookie('bugsVisited', bugsVisited, { maxAge: 60 * 1000 })
                if (3 < bugsVisited.length) return res.status(401).send('Wait for a bit or login to see more bugs!')
            }
            return res.send(bug)
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send(`Cannot get bug with id=${bugId}`)
        })
})

// Update bug
app.put('/api/bug', (req, res) => {
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    if (! loggedInUser) return res.status(401).send('Cannot update bug: Not logged in')
    const updatedBug = {
        _id: req.body._id,
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
    }
    bugService.save(updatedBug, loggedInUser)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(`Cannot put bug with id=${req.body._id}`)
        })
})

// Create bug
app.post('/api/bug', (req, res) => {
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    if (! loggedInUser) return res.status(401).send('Cannot create bug: Not logged in')
    const newBug = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
    }
    bugService.save(newBug, loggedInUser)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(`Cannot post bug`)
        })
})

// Delete bug
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    if (! loggedInUser) return res.status(401).send('Cannot delete bug: Not logged in')
    bugService.remove(bugId, loggedInUser)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(`Cannot delete bug with id=${bugId}`)
        })
})


// User
// Get all users
app.get('/api/user', (req, res) => {
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    if (! loggedInUser && ! loggedInUser.isAdmin) return res.status(401).send('Cannot get users: Not admin')
    userService.query()
        .then(users => res.send(users))
        .catch(err => console.error(err) || res.status(400).send('Cannot get users'))
})

// Signup
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => console.log(err) || res.status(400).send('Cannot signup: ' + err))
})

// Login
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid credendials')
            }
        })
})

// Logout
app.post('/api/auth/logout', (req, res) => {
    const loginToken = req.cookies.loginToken
    const loggedInUser = userService.validateLoginToken(loginToken)
    if (! loggedInUser) return res.status(401).send('Cannot logout: Not logged in')
    res.clearCookie('loginToken')
    res.send('Logged out')
})


// Static

// // Website
// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

const PORT = 3031

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))