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
        //created a placeholder grabbing the value from the user input form
        const updatedField = { [event.target.name] : event.target.value }
        //assigned the empty state with the updatedField into one object
        const editedItem = Object.assign(item, updatedField)
        //assigned the new object to be updated to the state
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