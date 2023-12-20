const { useState } = React

export function LongText(props) {
    const [isLong, setIsLong] = useState(false)

    const text = props.text
    const length = props.length || 100

    function textToShow() {
        if (text.length <= length || isLong) return text
        return text.slice(0, length) + '...'
    }

    function toggleIsLong() {
        setIsLong(prevIsLong => ! prevIsLong)
    }

    return (
        <span>
            <span>
                {textToShow()}
            </span>
        {
            length < text.length &&
            <button onClick={toggleIsLong}>
                {isLong ? 'Less' : 'More'}
            </button>
        }
        </span>
    )
}