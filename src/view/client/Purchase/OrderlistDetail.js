import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";

export default class OrderlistDetail extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      orders: []
    };
  }

  async componentDidMount() {
    if (true) {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/orders",
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      );
      if (!response.ok) {
        return;
      }

      let orders = await response.json();
      
      this.setState({
        loading: false,
        authenticate: true,
        orders: orders,
      });
      return;
    }
  }

  removeOrder = (id) =>{
    var orders = this.state.orders
    orders.map((order,index)=>{
        order.status = 'cancled';
    })
    alert("Bạn đã hủy thành công đơn hàng!");
    this.setState({orders:orders})
    axios
      .put(process.env.REACT_APP_BACKEND_URL + '/orders/' + id, {
        status : 'cancled'
      },{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        },
      })
      .then(response => {
       
      })
      .catch(error => {
        alert('An error occurred, please check again.');
        console.log('An error occurred:', error.response);
      });
    return
  }
  render() {
      
    var total = 0
    return (
      <div className="Account_layout">
        <h3 className="styles_Heading">
          {`Chi tiết đơn hàng#${this.props.match.params.id.slice(0, 9)}
          -${this.state.orders.map((order)=>{
            if (order.id === this.props.match.params.id) {
                  return order.status
              }
          })}
          ` 
          }
        </h3>
        <div className="order-detail">
          <table className="productlist">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số cuộn</th>
                <th>Số mét</th>
                <th>Mau</th>
                <th>Tạm tính</th>
                
              </tr>
            </thead>
            <tbody>
              {this.state.orders.map((order, index) => {
                  
                if (order.id === this.props.match.params.id) {
                  return (
                    <>
                      {order.productList.map((item, index) => {
                          total += item.product.price * item.quantity;
                        return (
                          <tr>
                            <td>
                              <div className="product-item">
                                <img
                                  src={process.env.REACT_APP_BACKEND_URL + item.product.image.url}
                                  alt=""
                                />
                                <div className="product-info">
                                  <a className="product-name">
                                  {item.product.name}
                                  </a>
                                  <p className="product-seller">{item.product.description}</p>
                                 
                                </div>
                              </div>
                            </td>
                            <td className="price">{item.product.price}đ</td>
                            <td className="quantity">{item.quantity}</td>
                            <td className="discount">{item.quantity_m}</td>
                            <td className="discount">{item.color}</td>
                            <td className="total">{item.product.price * item.quantity}đ</td>

                          </tr>
                        );
                      })}
                    </>
                  );
                }
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">
                  <span>Tạm tính</span>
                </td>
                <td>{total}đ</td>
              </tr>
              <tr>
                <td colSpan="4">
                  <span>Phí vận chuyển</span>
                </td>
                <td>0đ</td>
              </tr>
              <tr>
                <td colSpan="4">
                  <span>Tổng cộng</span>
                </td>
                <td>
                  <span className="sum">{total}đ</span>
                </td>
              </tr>
              <tr>
                <td colSpan="4"></td>
                <td>
                {
                    this.state.orders.map((order,index)=>{
                        if (order.id === this.props.match.params.id) {
                            
                                if(order.status ==='waiting'){
                                    return(
                                        <Link title="Hủy đơn hàng" className="cancel" onClick={()=>this.removeOrder(this.props.match.params.id)}>
                                            Hủy đơn hàng
                                        </Link>
                                    )
                                }
                                else if(order.status ==='cancled'){
                                    return(
                                        <Link title="Hủy đơn hàng" className="cancel" style={{backgroundColor:'#999999',borderColor:'#999999'}}>
                                        Đơn hàng đã hủy
                                        </Link>
                                    )
                                }
                                else{
                                  return(
                                    <></>
                                  )
                                }
                           
                        }
                    })
                }
                   
                
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}
