import React, { Component, SyntheticEvent } from "react";

export default class Signin extends Component {
  state = {
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
          <h5 className="grey-text text-darken-3">Sign in</h5>
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
            <input
              value="Login"
              type="submit"
              className="btn pink lighten-1 z-depth-0"
            />
          </div>
        </form>
      </div>
    );
  }
}
