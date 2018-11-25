import React, { Component, SyntheticEvent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { User } from "./interfaces";
import { signUp } from "./store/authActions";

interface Props {
  auth: any;
  authError: string;
  signUp: any; // function
}

class Signup extends Component<Props, any> {
  state: User = {
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
    this.props.signUp(this.state);
    console.log(this.state);
  };

  render() {
    if (this.props.auth.uid) return <Redirect to="/" />;
    const { authError } = this.props;
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
            <label htmlFor="lastName">Last Name</label>
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
          <div className="red-text center">
            {authError ? <p>{authError}</p> : null}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signUp: (newUser: User) => dispatch(signUp(newUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
