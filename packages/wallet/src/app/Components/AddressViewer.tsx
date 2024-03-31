const AddressViewer = (props: { address: string }) => {
  console.log('Address:', props.address)
  return (
    <div>
      {props.address!.length > 20
        ? props.address.slice(0, 7) + '...' + props.address.slice(-5)
        : props.address}
    </div>
  )
}

export default AddressViewer
