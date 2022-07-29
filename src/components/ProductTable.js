const ProductTable = ({item}) => {
  return (
    <>
    <tr>
      <th>{item.name}</th>
      <td>{item.revenue}</td>
    </tr>
    </>
  )
}

export default ProductTable