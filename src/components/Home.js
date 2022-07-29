import { useState, useEffect } from 'react'
import ProductTable from "./ProductTable"


const Home = () => {
  const [products, setProducts] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [sortField, setSortField] = useState("")
  const [order, setOrder] = useState("asc")
   
  //Initially load data from prodcts.json
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('./products.json',
          { headers: {'Content-Type': 'application/json','Accept': 'application/json'}})   
        const { products } = await response.json()
        if (products) {
          setProducts(products)
          setSearchResult(products)
          setTotalRevenue(products.reduce((sum, current) => sum + Number(current.revenue), 0))
          setLoading(false)
        }      
      } catch (error) {
        setError(error)
      }
    }
    getProducts()
  }, [])

  //handle submit form
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  //handle search value changes
  const handleChange = (e) =>{
    if(e.target.value === ''){
      setSearchResult(products)
    } 
    const resultArray = products.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setSearchResult(resultArray)
    setTotalRevenue(resultArray.reduce((sum, current) => sum + Number(current.revenue), 0))
    setSearchTerm(e.target.value)
  }

  // handle sorting
  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc"
    setSortField(accessor)
    setOrder(sortOrder)
    handleSorting(accessor, sortOrder)
  }
    
  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...searchResult].sort((a, b) => {
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {numeric: true}) * (sortOrder === "asc" ? 1 : -1)
        )
      })
      setSearchResult(sorted)
    }
  }

  if (loading) {
    return (
        <div>Loading</div>
    )
  }
  if (error) {
    return (
        <div>{ error}</div>
    )
  }

  return searchResult && (
    <div className='d-flex justify-content-center flex-column'>
      <h3 className='text-center p-3'>Revenue Generator</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3 mx-auto w-50">
          <label htmlFor="name" className="form-label">
            search your products
          </label>
          <input type="text" name="name" id="name" className="form-control" value={searchTerm} onChange={handleChange} />
        </div>
      </form>
    <table className="table w-50 m-auto table-striped">
      <thead>
        <tr>
          <th scope="col" onClick={() => handleSortingChange('name')}>Name</th>
          <th scope="col" onClick={() => handleSortingChange('revenue')}>Revenue</th>
        </tr>
      </thead>
      <tbody>
     {
    searchResult.map((item) => (
                <tr key={item.id}>
      <td>{item.name}</td>
      <td>{item.revenue}</td>
    </tr>
            ))
                    }
                    <tr>
                        <td>Total Revene</td>
                        <td>{ totalRevenue}</td>
                    </tr>
    
  </tbody>
</table>
        </div>
      
  )
   
   
  }


export default Home

/*
filter((val) => {
        if (search === '') {
          console.log('val',val)
                               
                    return val
        } else if (val.name.toLowerCase().includes(search.toLowerCase())) {
            
             console.log('val',val)
                              return val  
                }
    })

*/