import React, { Component, SyntheticEvent } from "react";

export default class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };

  handleChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Sign up</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              value={this.state.email}
              type="email"
              id="email"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              value={this.state.password}
              type="password"
              id="password"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="firstName">First Name</label>
            <input
              value={this.state.firstName}
              type="text"
              id="firstName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">First Name</label>
            <input
              value={this.state.lastName}
              type="text"
              id="lastName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <input
              value="Create account"
              type="submit"
              className="btn pink lighten-1 z-depth-0"
            />
          </div>
        </form>
      </div>
    );
  }
}
