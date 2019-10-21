import React, { Component } from 'react';
import axios from 'axios';
import Main from '../template/Main';


const headerProps = {
    icon: 'users',
    title: 'Users',
    subtitle: 'User Registration: Create, Read, Update and Delete!'
}

const baseUrl = "http://localhost:3001/users";
const initialState = {
    user: { name: '', email: '' },
    usersList: []
}

export default class UserCrud extends Component {
    state = { ...initialState };

    constructor(props) {
        super(props);
        this.clearInputs = this.clearInputs.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.updateUserState = this.updateUserState.bind(this);
        this.loadUser =  this.loadUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

    componentWillMount() {
        axios.get(baseUrl).then(resp => {
            this.setState({ usersList: resp.data });
        })
    }

    clearInputs() {
        this.setState({ user: initialState.user });
    }

    saveUser() {
        const user = this.state.user;
        const method = user.id ? "put" : "post";
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;
        axios[method](url, user)
            .then(resp => {
                const usersList = this.getUpdatedUsersList(resp.data);
                this.setState({ user: initialState.user, usersList });
            })
    }

    getUpdatedUsersList(user) {
        const updatedUsersList = this.removeCurrentUser(user);
        updatedUsersList.unshift(user);
        return updatedUsersList;
    }

    removeCurrentUser(user) {
        const newUsersList = this.state.usersList.filter(u =>
            u.id !== user.id
        );
        return newUsersList;
    }

    updateUserState(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label>Name</label>
                        <input type="text" name="name" className="form-control"
                            value={this.state.user.name}
                            onChange={e => this.updateUserState(e)}
                            placeholder="Type the name..." />
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" name="email" className="form-control"
                                value={this.state.user.email}
                                onChange={e => this.updateUserState(e)}
                                placeholder="type the email..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={this.saveUser}>
                            Save
                        </button>
                        <button className="btn btn-secondary ml-2"
                            onClick={this.clearInputs}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    loadUser(user) {
        this.setState({ user });
    }

    removeUser(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const usersList = this.removeCurrentUser(user);
            this.setState({ usersList });
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.usersList.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="d-flex">
                        <button className="btn btn-warning"
                            onClick={() => this.loadUser(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.removeUser(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                <h2>Registered Users</h2>
                {this.renderTable()}
            </Main>
        )
    }
}