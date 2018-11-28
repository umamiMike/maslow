import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn } from "./store/authActions";
import { AuthState } from "./interfaces";
import { Redirect } from "react-router-dom";

interface Props {
  signIn: any; //fixme
  authError: string;
  auth: any;
}

class Signin extends Component<Props, any> {
  state: AuthState = {
    email: "",
    password: ""
  };

  handleChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value }); // fixme
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.signIn(this.state); // fixme: TS does not like this?
  };

  render() {
    if (this.props.auth.uid) return <Redirect to="/" />;
    const { authError } = this.props;
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
    // fixme
    signIn: (credentials: any) => dispatch(signIn(credentials))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin);
