import React from "react";
import './styles/ContainerDM.css'
import Login from "../routes/auth/login";


export default class ContainerDM extends React.Component {

  constructor(props) {
    super(props);
    this.handleSuccesfulAuth = this.handleSuccesfulAuth.bind(this);

  }
  handleSuccesfulAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/Services");
    window.location.reload();
  }

  render() {
    return (
      <div>
        {/* <h1>Login Page</h1>
          <h1>Status : {this.props.loggedInStatus}</h1> */}
        <Login handleSuccesfulAuth={this.handleSuccesfulAuth} />
      </div>
    )
  }
}