
![](https://i.imgur.com/u6YtqLj.gif)



## First Step

# React => MERN

![](StackArchitecture.png)

The backend has been finished, now we will build the front end 

React will be used to implement CRUD in our front end





Let us double check that our database exists:

```sh
mongo
> use itemsDatabase
> db.items.find()
```

If your database has no items in it, you might have forgotten to populate the database from the previous part
 run the comand below to seed them, if your database already has items in it, you can ignore the code snippet below
```sh
node seed/items.js
```


Now run the server (after ensuring the database is populated):

```sh
npm start
```

Test the following route in your browser:

- http://localhost:3000/api/items

Now open a new tab in the terminal. Make sure you're inside the repo.

Let's create our React app.

```sh
cd crud-react
npx create-react-app client
```

Let's start by adding [react router]():

```sh
cd client
npm install react-router-dom
```
> Important: Notice how there are two package.json's one in the root of the repo for the server, and the other inside the client folder. Make sure you're inside the client folder. We want to install the react router package so we can use it for the react app.

And now let's setup our app to use react router:

client/index.js
```js
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

Cool. Now let's setup our routes.  A route will render an associated component. Below is the list:

`/` - the homepage, just display a welcome screen. It will render a Home component.

`/items` - the ability to see all items. It will render an Items component.

`/create-item` - the ability to create a new item. It will render an ItemCreate component.

`/items/:id` - the ability to see a specific item. It will render an Item component.

`/items/:id/edit` - the ability to edit an item. It will render an ItemEdit component.

Let's start by creating our empty components:

```sh
cd src
mkdir components
cd components
mkdir routes
cd routes
touch Home.js Item.js ItemCreate.js ItemEdit.js Items.js
```

Now let's create our routes:

client/App.js
```js
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/routes/Home';
import Items from './components/routes/Items';
import ItemCreate from './components/routes/ItemCreate';
import Item from './components/routes/Item';
import ItemEdit from './components/routes/ItemEdit';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <h3>{location.state ? location.state.msg: null }</h3>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/items' element={<Items />} />
        <Route path='/create-item' element={<ItemCreate />} /> 
        <Route path='/items/:id' element={<Item />} />
        <Route path='/items/:id/edit' element={<ItemEdit />} /> 

      </Routes>

    </div>
  );
}


export default App;
```

A simple Home component:
src/components/routes/Home.jsx
```js
import Layout from '../shared/Layout';


const Home = () => {
  return (
  <Layout>
    <h4>Welcome to the items app!</h4>
    </Layout>
  )
}

export default Home
```

Notice the Layout component. We are going to build the Layout component next. This is a shared component that we will re-use multiple times. Essentially, the Layout component is the shell of the web app we are building.

Let's create our "shared" components. The idea of shared components is that anytime we have code that we would repeat in several components (a footer, a navbar, etc), we can wrap that code inside a component and import it in whenever needed.

```sh
cd client/src/components
mkdir shared
cd shared
touch Layout.js Footer.js Nav.js
```

Let's start with the Layout component:

components/shared/Layout.jsx
```js
import Nav from './Nav'
import Footer from './Footer'


const Layout = (props) => {
  return (
  <div>
    <h1>Items App</h1>
    <Nav />

    {props.children}

    <Footer />
    </div>
  )
}

export default Layout
```

> Note: We are using `props.children` here. [React Children](https://reactjs.org/docs/react-api.html#reactchildren) is a placeholder for which ever component calls the component that `props.children` is in. 

Let's create our Nav component:

components/shared/Nav.jsx
```js
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
```

And the Footer component:

components/shared/Footer.jsx

```js
const Footer = () => {
  return (
    <p>© Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
  )
}

export default Footer
```

Let's make sure the app is working.

```sh
cd crud-react
npm start
```

Open a new tab in your terminal and run your client:

```sh
cd client
npm start
```

Open your browser and test the route http://localhost:3001/. The Home component should render but the other links will not work yet because we haven't built them out yet.

Cool. We are done with shared components for now.

Now let's build the Items component.

We will be making an axios call in the Items component to fetch all the Items from the server. 

Let's start by installing [axios](https://www.npmjs.com/package/axios). Make sure you're in the client folder.

```sh
cd client
npm install axios
```

> When you run `npm install axios`, make sure you're inside the client folder where the package.json exists.

Now we can build the Items component:

src/components/routes/Items.js
```js
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';

function Items() {
  const [items, setItems] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios('http://localhost:3000/api/items')
      setItems(response.data.items)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const itemsData = items.map((item) => {
    return <li key={item._id}>
      <NavLink to={`/items/${item._id}`} >{item.title}</NavLink>
    </li>
  })

  return (
    <div>
      <h4>Items</h4>
      <ul>
        {itemsData}
      </ul>
  </div>
)
}
export default Items
```

Test the http://localhost:3001/items route in your browser.

Good? Great. Let's move on to the Item component.

components/routes/Item.jsx
```js
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../shared/Layout'


function Item() {
  const [item, setItem] = useState([])
  const [deleted, setDeleted] = useState(false)
  const { id } = useParams();
  let navigate = useNavigate();

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`http://localhost:3000/api/items/${id}`)
        console.log(response)
        const result = response.data.item
    setItem(result)
      
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!item) {
      return <p>Loading...</p>
    }
  }, [item])

  const destroy = () => {
   axios({
      url: `http://localhost:3000/api/items/${id}`,
      method: 'DELETE'
    }).then(() => setDeleted(true)).catch(console.error)
  }

  useEffect(() => {
    if (deleted) {
      return navigate("/")
    }
  }, [deleted, navigate])

  

  return (

    

    <Layout>

      <h4>{item.title}</h4>
      <p>Link: {item.link}</p>
      <button onClick={() => destroy()} >Delete Item</button>

      <NavLink to={`/items/${id}/edit`} >
        <button>Edit</button>
      </NavLink>

      <NavLink to="/items" >Back to all items</NavLink>
      
    </Layout>
  )
}

export default Item

```

We should now be able to see http://localhost:3001/items/1.

Next, we want to implement the ItemEdit and ItemCreate. Inside the ItemEdit component we will have a form to edit an item. And Inside the ItemCreate component we will have form to create an item. What if we could abstract those two forms into one? We can, so let's do that now by creating another shared component called ItemForm:

```sh
cd components/shared/
touch ItemForm.jsx
```

components/shared/ItemForm.jsx
```js
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
```

Awesome! Now let's build our ItemEdit component:

components/routes/ItemEdit.jsx
```js
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import Layout from "../shared/Layout";
import ItemForm from "../shared/ItemForm";
function ItemEdit(){
    const navigate = useNavigate()
    const { id } = useParams()  //get the id from the current object to update
    const [item, setItem] = useState({
        title: '',
        link: ''
    })
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
       try {
           const response = await axios(`http://localhost:3000/api/items/${id}`)
           console.log(response)
           setItem(response.data)
       } catch (error) {
           console.log(error)
       }
      }
      fetchData()
    }, [])

    const handleChange = (event) => {
  
        const updatedField = { [event.target.name] : event.target.value }
     
        const editedItem = Object.assign(item, updatedField)
   
        setItem(editedItem)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
         axios({
             url: `http://localhost:3000/api/items/${id}`,
             method: 'PUT',
             data: item
         }).then(() => setUpdated(true)).catch(console.error)
    }

    useEffect(() => {
        if(updated) {
            return navigate(`/items/${id}`)
        }
    })

     return(
         <Layout>
             <ItemForm
               item={item}
               handleChange={(e) => handleChange(e)}
               handleSubmit={(e) => handleSubmit(e)}
               cancelPath={`/items/${id}`}
               />
         </Layout>
      )
    }
export default ItemEdit
```

Let's test that. Open http://localhost:3001/items/1 and edit a field.

Nice! Now try delete. Bye.

Ok. We have one last CRUD action to complete in our react app - CREATE. Let's build the ItemCreate component and use our ItemForm shared component:

components/routes/ItemCreate.jsx
```js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../shared/Layout';
import ItemForm from '../shared/ItemForm';

function ItemCreate() {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    link: '',
  })
  const [createdItem, setCreatedItem] = useState(null)

  const handleChange = (event) => {
    //created a placeholder grabbing the value from the user input form
    const updatedField = { [event.target.name] : event.target.value }
    //assigned the empty state with the updatedField into one object
    const editedItem = Object.assign(item, updatedField)
    //assigned the new object to be updated to the state
    setItem(editedItem)
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()

    //if the entry is created in the database, save the response data
    // in the state
    axios({
      url: `http://localhost:3000/api/items`,
      method: 'POST',
      data: item
    }).then(res => setCreatedItem(res.data.item)).catch(console.error)

  }

  useEffect(() => {
    if (createdItem) {
      return navigate(`/items`)
    }
  }, [createdItem, navigate])

  return (
    <Layout>
      <ItemForm
        item={item}
        handleChange={(e) => handleChange(e)}
        handleSubmit={(e) => handleSubmit(e)}
        cancelPath='/'
      />
    </Layout>

  )
}

export default ItemCreate
```

Now test the create in your browser.

We now have a fully functional MERN Stack application. 

