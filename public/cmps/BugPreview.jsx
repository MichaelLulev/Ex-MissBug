import { LongText } from "./LongText.jsx"

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function BugPreview({bug}) {
    
    function getTime() {
        const now = Date.now()
        const { createdAt } = bug
        const timeDiff = now - createdAt
        if (timeDiff < MINUTE) return Math.floor(timeDiff / SECOND) + ' seconds ago'
        if (timeDiff < HOUR) return Math.floor(timeDiff / MINUTE) + ' minutes ago'
        if (timeDiff < DAY) return Math.floor(timeDiff / HOUR) + ' hours ago'
        return Math.floor(timeDiff / DAY) + ' days ago'
    }
    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Labels: <span>{bug.labels.join(', ')}</span></p>
        <p>Description: <span><LongText text={bug.description} length={50}/></span></p>
        <p>Created: <span>{getTime()}</span></p>
    </article>
}