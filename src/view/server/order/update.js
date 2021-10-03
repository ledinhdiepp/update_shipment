import React, { Component } from 'react'
import Cookie from "js-cookie"
import axios from "axios"
import Modal from 'react-modal'

class OrderUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      authenticate: true,
      products: [],
      users: [],
      buyingItem:{color:'RED',quantity:'',quantity_m:''},
      order: {
        productList: []
      },
      modal: {
        isOpen: false
      },
      userFilter: '',
      productFilter:{
        id: '',
        name: '',
        category: 'all'
      },
      productCategories: []
    }
  }

  async componentDidMount() {
    if(Cookie.get('role') === 'Admin'){     
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/orders/" + this.props.match.params.id,{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        },
      });
      if (!response.ok) {
        return
      }

      axios
        .get(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
          headers:{
            'Authorization' : 'bearer ' + Cookie.get('token')
          }
        })
        .then(res=>{
          this.setState({productCategories:res.data})
        })
        .catch(err=>{
          alert('Cannot connect to server!!!!')
          console.log(err.response)
        })

      axios
        .get(process.env.REACT_APP_BACKEND_URL + "/users",{
          headers:{
            'Authorization' : 'bearer ' + Cookie.get('token')
          }
        })
        .then(res=>{
          this.setState({users:res.data})
        })
        .catch(err=>{
          alert('Cannot connect to server!!!!')
          console.log(err.response)
        })

      await axios
        .get(process.env.REACT_APP_BACKEND_URL + '/products',{
          headers:{
            'Authorization' : 'bearer ' + Cookie.get('token')
          }
        })
        .then(res=>{
          this.setState({products:res.data})
        })
        .catch(err=>{
          alert('Cannot connect to server!!!!')
          console.log(err.response)
        })

      let data = await response.json();
      this.setState({ loading: false, authenticate: true, order: data});
      return
    }
    this.setState({authenticate: false});
  }

  updateOrderClick = (event) =>{
    event.preventDefault()
    axios
      .put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
        status: this.state.order.status,
        productList: this.state.order.productList,
        note: this.state.order.note
      },{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        },
      })
      .then(response => {
        alert("Update order success!");
        this.props.history.push('/admin/orders')
      })
      .catch(error => {
        alert('An error occurred, please check again.');
        console.log('An error occurred:', error.response);
      });
    return
  }

  addProductClick = (event) =>{
    event.preventDefault()
    this.openModal()
  }

  confirmProductClick = (event,item) =>{
    event.preventDefault()
    let newList = [...this.state.order.productList,item]
    this.setState({order:{...this.state.order,productList:newList}})
    this.setState({buyingItem:{...this.state.buyingItem,color:'RED',quantity:'',quantity_m:''}})
  }

  closeProductClick = (event) =>{
    event.preventDefault()
    this.setState({buyingItem:{color:'RED',quantity:'',quantity:''}})
  }

  chooseProductClick = (product) =>{
    this.setState({buyingItem:{...this.state.buyingItem,product: product}})
    this.closeModal()
  }

  removeProductClick = (event,index) =>{
    event.preventDefault()
    let productList = this.state.order.productList
    productList.splice(index,1)
    this.setState({order:{...this.state.order,productList:productList}})
  }

  openModal = () =>{
    this.setState({modal:{isOpen: true}})
  }

  closeModal = () =>{
    this.setState({modal:{isOpen: false}})
  }

  render() {
    const clickBack = async (event) =>{
      event.preventDefault()
      this.props.history.push('/admin/orders')
    }  
    const showBuyingProduct = () =>{
      if(this.state.buyingItem.product !== undefined){
        return (
          <div className='col-10 m-auto'>
            <div className='row d-flex align-items-center'  style={{marginTop: 15+ 'px'}}>
              <div className='col-2'>
                <img src={process.env.REACT_APP_BACKEND_URL + this.state.buyingItem.product.image.url}
                  description image></img>
              </div>
              <div className='col-2'>
                <span>{this.state.buyingItem.product.name}</span><br/>
                <span>{this.state.buyingItem.product.category.name}</span>
              </div>
              <div className='col-8'>
                <div className='row d-flex align-items-center'>
                  <div className='col-lg-4 d-flex align-items-center'>
                    <label className='float-left'>Color:</label>
                    <div className='float-left'>
                      <select onChange={e=>this.setState({buyingItem:{...this.state.buyingItem,color:e.target.value}})} 
                        value={this.state.buyingItem.color} className='short-input'>
                        <option value='RED'>red</option>
                        <option value='YELLOW'>yellow</option>
                        <option value='BLUE'>blue</option>
                        <option value='GREEN'>green</option>
                      </select>
                    </div>
                  </div>

                  <div className='col-lg-3 d-flex align-items-center'>
                    <label className='float-left'>roll:</label>
                    <input onChange={e=>this.setState({buyingItem:{...this.state.buyingItem,quantity:Number(e.target.value)}})}
                      type='number' value={this.state.buyingItem.quantity} className='float-left short-input'
                    />
                  </div>

                  <div className='col-lg-3 d-flex align-items-center'>
                    <label className='float-left'>m:</label>
                    <input onChange={e=>this.setState({buyingItem:{...this.state.buyingItem,quantity_m:Number(e.target.value)}})}
                      type='number' value={this.state.buyingItem.quantity_m} className='float-left short-input'
                    />
                  </div>

                  <div className='col-lg-2 d-flex' style={{alignItems:'center'}}>
                    <button className='hiden-btn' onClick={e=>this.confirmProductClick(e,this.state.buyingItem)}>
                      <i className='fa fa-plus icon'></i>
                    </button>
                    <button className='hiden-btn ml-3' onClick={e=>this.closeProductClick(e)}>
                      <i className='fa fa-close icon'></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{borderColor:'#29b7d3'}}/>
          </div>
        )
      }
    }

    if (!this.state.loading && Cookie.get('token')) {
      return (
        <div className='OrderCreate'>
          <Modal
            isOpen={this.state.modal.isOpen}
            onRequestClose={this.closeModal}
            contentLabel="Select product"
          >
            <div style={{marginBottom: 30+'px'}}>
                <h2 className='pull-left'>Select product</h2>
                <button className='pull-right btn' onClick={this.closeModal}>
                  <i className='fa fa-close'></i>
                </button>
            </div>

            <div style={{marginBottom: 30+'px'}}>
              <form className="form-inline w-100">                
                <div className='input-prepend' style={{marginRight: 30+'px'}}>
                  <span className='add-on'>Name</span>
                  <input
                    type="text" className='form-control'
                    onChange={e=>this.setState({productFilter:{...this.state.productFilter,name:e.target.value}})}
                  />
                </div>

                <div className='input-prepend' style={{marginRight: 30+'px'}}>
                  <span className='add-on'>ID</span>
                  <input 
                    type="text" className='form-control'
                    onChange={e=>this.setState({productFilter:{...this.state.productFilter,id:e.target.value}})}
                  />
                </div>

                <div className='input-prepend'>
                  <span className='add-on'>Category</span>
                  <select className='from-control'
                    onChange={e=>this.setState({productFilter:{...this.state.productFilter,category:e.target.value}})}
                  >
                    <option value='all'>All</option>
                    {this.state.productCategories.map((category,index)=>{
                      return(
                        <option key={index} value={category.name}> {category.name} </option>
                      )
                    })}
                  </select>
                </div>
              </form>
            </div>

            <table className="table">
              <thead>
              <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>createAt</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
                {this.state.products.filter(product=>
                  product.id.includes(this.state.productFilter.id)
                  && product.name.includes(this.state.productFilter.name)
                  &&
                  (this.state.productFilter.category==='all' ? true :  product.category.name===this.state.productFilter.category)
                ).map((product, index) => {
                  return (
                    <tr key={index} onClick={()=>this.chooseProductClick(product)}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category.name}</td>
                      <td>{product.price}</td>
                      <td>{product.createdAt.slice(0,10) + " " + product.createdAt.slice(11,16)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Modal>

          <div className='module'>
            <div className='module-head'>
              <h2>Update Order</h2>
            </div>

            <div className='module-body'>
              <form>
                <div className='row'>
                  <div className='col-lg-12'>
                    <div className="form-group">
                      <label> Status: </label>
                      <select value={this.state.order.status}
                        onChange={e=>this.setState({order:{...this.state.order,status:e.target.value}})}>
                        <option value='waiting'>Waiting</option>
                        <option value='processing'>Processing</option>
                        <option value='waiting to deliver'>Waiting to deliver</option>
                        <option value='delivering'>Delivering</option>
                        <option value='delivered'>Delivered</option>
                        <option value='partial delivering'>Partial delivering</option>
                        <option value='partial delivered'>partial delivered</option>
                        <option value='done'>Done</option>
                        <option value='cancled'>Cancled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='row' style={{marginBottom:20+'px'}}>
                  <div className='col-lg-12'>
                    <label>Products list:</label>
                    <button className='btn btn-info' onClick={e=>this.addProductClick(e)}>Add products</button>
                    {showBuyingProduct()}
                    <table className='table'>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Color</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.order.productList.map((item,index)=>{
                        return(
                          <tr key={index}>
                            <td style={{width: 200 + 'px'}}>
                              <img className='img-preview' src={process.env.REACT_APP_BACKEND_URL + item.product.image.url}
                                alt='preview image'></img>
                            </td>
                            <td>{item.product.name}</td>
                            <td style={{color:item.color.toLowerCase()}}>{item.color}</td>
                            <td>
                              {item.quantity_m ? 
                                (item.quantity? 
                                item.quantity_m + ' x m,' + item.quantity + ' x roll'
                                : item.quantity_m + ' x m')
                                :item.quantity + ' x roll'
                              }
                            </td>
                            <td>
                              <button className='hiden-btn' onClick={e=>this.removeProductClick(e,index)}>
                                <i className='fa fa-trash icon' style={{color:'red'}}></i>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className='row'>
                  <div className='col-lg-6'>
                    <div className="form-group">
                      <label> Note: </label>
                      ​<textarea className='row-fluid' value={this.state.order.note}
                        onChange={e=>this.setState({order:{...this.state.order,note:e.target.value}})}></textarea>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-2'>
                    <button className='btn btn-primary' onClick={e=>this.updateOrderClick(e)}>Update</button>
                  </div>
                  <button className='btn btn-primary' onClick={e=>clickBack(e)}>Back</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }
    if(!this.state.authenticate){
      return <h2>You need to login</h2>
    }
    return (<h2>Waiting for API...</h2>);
  }
}

export default OrderUpdate;