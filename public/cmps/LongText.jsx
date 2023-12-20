const { useState } = React

export function LongText(props) {
    const [isLong, setIsLong] = useState(false)

    const text = props.text
    const length = props.length
    const isExpandable = props.expandable

    function textToShow() {
        if (text.length <= length || isLong) return text
        return text.slice(0, length) + '...'
    }

    function toggleIsLong() {
        setIsLong(prevIsLong => ! prevIsLong)
    }
    
    if (! text || ! length) return <span></span>
    return (
        <span>
            <span>
                {textToShow()}
            </span>
        {
            isExpandable && length < text.length &&
            <button onClick={toggleIsLong}>
                {isLong ? 'Less' : 'More'}
            </button>
        }
        </span>
    )
}