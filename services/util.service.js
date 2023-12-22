export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromFile,
    saveToFile,
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function loadFromFile(dir, path, elementsCreator) {
    return fs.readFile(path, 'utf-8')
        .then(res => {
            let elements = JSON.parse(res)
            if (! elements || elements.length === 0) return Promise.reject('No elements in path ' + path)
            return elements
        })
        .catch(err => {
            console.error(err)
            console.log('Creating elements')
            const elements = elementsCreator()
            return saveToFile(dir, path, elements).then(() => elements)
        })
}

function saveToFile(dir, path, elements=[]) {
    console.log('Saving elements to path ' + path)
    const strElements = JSON.stringify(elements, null, '\t')
    return fs.stat(dir)
        .catch(() => fs.mkdir(dir))
        .then(() => fs.writeFile(path, strElements, 'utf-8'))
}