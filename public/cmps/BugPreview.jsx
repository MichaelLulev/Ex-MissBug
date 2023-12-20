import { LongText } from "./LongText.jsx"

export function BugPreview({bug}) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Description: <span><LongText text={bug.description} length={40}/></span></p>
    </article>
}