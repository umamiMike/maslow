import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn } from "./store/authActions";
import { AuthState } from "./interfaces";
import { Redirect } from "react-router-dom";
import InputField from "./components/InputField";

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
      <div className="flex justify-center align-center pt-6">
        <div className="w-full max-w-xs">
          <form
            onSubmit={this.handleSubmit}
            className="bg-yellow-lightest shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <InputField
              label="Email"
              value={this.state.email}
              handleChange={this.handleChange}
              placeholder="user@gmail.com"
              type="email"
            />
            <InputField
              label="Password"
              value={this.state.password}
              handleChange={this.handleChange}
              placeholder="***************"
              type="password"
            />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <div className="text-center text-red text-xl">
            {authError ? <p>{authError}</p> : null}
          </div>
        </div>
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
