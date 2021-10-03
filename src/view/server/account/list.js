import React, { Component } from 'react'
import Cookie from 'js-cookie'
import axios from 'axios'
import { Link } from 'react-router-dom'

class AccountList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            authenticate: true,
            filter_username:'',
            filter_email:'',
            users: []
        }
    }

    async componentDidMount(){
        let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/users",{
            headers: {
              'Authorization':'bearer '+ Cookie.get('token'),
            },
        });
        if (!response.ok) {
            return
        }
        let users = await response.json()
        this.setState({ loading: false,authenticate: true, users: users })
        return
    }
    
    render(){
        const clickInfo = (id) =>{
            this.props.history.push('/admin/accounts/'+id)
        }
    
        const clickUpdate = (id) =>{
            this.props.history.push('/admin/accounts/'+id+'/update')
        }
    
        const clickDestroy = (id) =>{
            axios
            .delete(process.env.REACT_APP_BACKEND_URL + "/users/" + id,{
                headers: {
                'Authorization':'bearer '+ Cookie.get('token'),
                },
            })
            .then(response => {
                alert('Destroy success.')
                this.props.history.push("/admin/accounts")
            })
            .catch(error => {
                alert('Update failed !!!')
                console.log('An error occurred:', error.response)
            });
        }

        return(
            <div className="DataList">
                <h2 className="DataList-title">Accounts ({this.state.users.length})</h2>
                <Link to='/admin/accounts/create'><button className="btn btn-primary"> Create A New Account</button></Link>
                <div className="DataList-container">
                    
                    <div className="DataList-filter" onSubmit={this.filterSubmmitHandle}>
                        <form className="form-inline w-100">
                            <div className='controls'>
                                <div className='input-prepend'>
                                    <span className='add-on'>Username</span>
                                    <input name="username_filter" type="text"
                                        onChange={e=>this.setState({filter_username: e.target.value})} value={this.state.filter_username}
                                        />
                                </div>
                            </div>

                            <div className='controls'>
                                <div className='input-prepend'>
                                    <span className='add-on'>Gmail</span>
                                    <input className="form-control" name="gmail_filter" type="text" 
                                    onChange={e=>this.setState({filter_email: e.target.value})} value={this.state.filter_email}
                                    />
                                </div>
                            </div>
                            
                            <button type="reset" className='btn btn-success'
                            onClick={ ()=>this.setState({filter_email:'',filter_username:''})} >Reset</button>
                        </form>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr class="heading">
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Blocked</th>
                                <th>Type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users
                            .filter(user=>
                            user.username.includes(this.state.filter_username)
                            && user.email.includes(this.state.filter_email)
                            )
                            .map((user, index) => {
                            return (
                                <tr key={index} >
                                    <td onClick={() =>clickInfo(user.id)}>{user.id}</td>
                                    <td onClick={() =>clickInfo(user.id)}>{user.username}</td>
                                    <td onClick={() =>clickInfo(user.id)}>{user.email}</td>
                                    <td onClick={() =>clickInfo(user.id)}>{user.blocked.toString()}</td>
                                    <td onClick={() =>clickInfo(user.id)}>{user.role.name}</td>
                                    <td >
                                        <i style={{fontSize:25 + "px",color:"blue",cursor:"pointer",marginRight:10 + "px"}} className="fa fa-edit" onClick={() =>clickUpdate(user.id)} ></i>
                                        <i style={{fontSize:28 + "px",color:"red",cursor:"pointer"}} className="fa fa-remove" onClick={() =>clickDestroy(user.id)} ></i>
                                    </td>
                                </tr>
                            )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default AccountList;