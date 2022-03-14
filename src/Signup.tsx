import React, { Component, SyntheticEvent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { UserType } from "./interfaces";
import { signUp } from "./store/authActions";
import InputField from "./components/InputField";

interface Props {
  auth: any;
  authError: string;
  signUp: any; // function
}

class Signup extends Component<Props, any> {
  state: UserType = {
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
              value={this.state.password || ""}
              handleChange={this.handleChange}
              placeholder="***************"
              type="password"
            />
            <InputField
              id="firstName"
              label="First Name"
              value={this.state.firstName}
              handleChange={this.handleChange}
              placeholder="Larhonda"
              type="text"
            />
            <InputField
              id="lastName"
              label="Last Name"
              value={this.state.lastName}
              handleChange={this.handleChange}
              placeholder="Steele"
              type="text"
            />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
        <div className="text-center text-red text-xl">
          {authError ? <p>{authError}</p> : null}
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
    signUp: (newUser: UserType) => dispatch(signUp(newUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
