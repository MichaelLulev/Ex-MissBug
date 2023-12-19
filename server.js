import express from 'express'
import cookieParser from 'cookie-parser'


const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => console.log('/api/bug'))
app.get('/api/bug/:bugId', (req, res) => console.log('/api/bug/:bugId ' + req.params.bugId))
app.get('/api/bug/:bugId/remove', (req, res) => console.log('/api/bug/:bugId/remove ' + req.params.bugId))
app.get('/api/bug/save', (req, res) => console.log('/api/bug/save'))

app.listen(3030, () => console.log('Server ready at port 3030'))