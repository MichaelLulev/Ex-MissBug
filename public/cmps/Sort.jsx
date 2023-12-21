



export function Sort(props) {

    function onChangeSortBy(ev) {
        const name = ev.target.name
        let value = ev.target.value
        if (name === 'isAscending') value = ev.target.checked
        props.onSetSortBy({ [name]: value })
    }

    return (
        <section className="sort">
            <h3>Sort</h3>
            <label>
                <span>Sort by: </span>
                <select
                    name="field"
                    value={props.sortBy.field}
                    onChange={onChangeSortBy}
                >
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created at</option>
                </select>
            </label>
            <label>
                <span>Ascending: </span>
                <input
                    type="checkbox"
                    name="isAscending"
                    value={props.sortBy.isAscending}
                    onChange={onChangeSortBy}
                />
            </label>
        </section>
    )
}