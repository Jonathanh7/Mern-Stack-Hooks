import { NavLink } from "react-router-dom";

const Nav = () => {
  return(
  <nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/items">Items</NavLink>
    <NavLink to="/create-item">Create Item</NavLink>
    </nav>
  )
}


export default Nav