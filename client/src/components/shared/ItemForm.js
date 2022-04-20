import { Link } from 'react-router-dom'
const ItemForm = ({item, handleSubmit, handleChange, cancelPath}) => {
    return(
        <form onSubmit={(e) => handleSubmit(e)}>
            <label>Title</label>
            <input
            placeholder="item to input"
            defaultValue={item.title}
            name="title"
            onChange={(e) => handleChange(e)} />
            <input
            placeholder="http://coolstuff.io"
            defaultValue={item.link}
            name="link"
            onChange={(e) => handleChange(e)} />
            <button type="submit">Submit</button>
            <Link to={cancelPath}>
                <button>Cancel</button>
            </Link>
        </form>
    )
}
export default ItemForm