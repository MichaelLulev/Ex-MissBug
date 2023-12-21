


export function Page(props) {

    function onChangePage(ev) {
        const className = ev.target.classList.value
        const name = ev.target.name
        let value = ev.target.value
        const idx = props.pageInfo.idx
        if (className === 'prev') value = Math.max(0, idx - 1)
        else if (className === 'next') value = idx + 1
        else if (name === 'bugsPerPage') value = +value
        props.onSetPageInfo({ [name]: value })
    }

    return (
        <section className="page">
            <h3>Page</h3>
            <button
                className="prev"
                name="idx"
                disabled={props.pageInfo.idx <= 0}
                onClick={onChangePage}
            >
                Previous
            </button>
            <span className="page-num">
                {+props.pageInfo.idx + 1}
            </span>
            <button
                className="next"
                name="idx"
                disabled={props.isLastPage}
                onClick={onChangePage}
            >
                Next
            </button>
            <label>
                <span>Bugs per page: </span>
                <select
                    name="bugsPerPage"
                    value={props.pageInfo.bugsPerPage}
                    onChange={onChangePage}
                >
                    <option>4</option>
                    <option>6</option>
                    <option>8</option>
                    <option>10</option>
                </select>
            </label>
        </section>
    )
}