import { Component } from 'react';
import { Switch, Route } from "react-router-dom"
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css"
import "flexboxgrid/css/flexboxgrid.css"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Profile from "./routes/profile"
import Dashboard from "./routes/dashboard"
import { AlertPage } from "./routes/alerts"
import MyCommunityOverview from "./components/MyCommunityOverview.jsx"
import Home from './components/Home'
import Contact from './components/Contact'
import Services from './components/Services';
import ContainerDM from './components/ContainerDM';
import Solution from './components/Solution';
import Community from './components/Community';
import ProtectedRoutes from './routes/auth/PrivateRoute';
import Progression from './components/Progression2'
import Favoris from './components/Favoris';
import BotImage from './data/icons/chatbot1.png'
import Modal from 'react-modal';
import 'react-chatbot-kit/build/main.css';
import { AskResetPassword } from './routes/forms/askResetPassword';
import { ResetPassword } from './routes/forms/resetPassword';
import { ChangePassword } from './routes/forms/changePassword';
//Lessons
import Lesson1 from './components/Lessons/Lesson1';
import Lesson2 from './components/Lessons/Lesson2';
import Lesson3 from './components/Lessons/Lesson3';
import Lesson4 from './components/Lessons/Lesson4';
import Lesson5 from './components/Lessons/Lesson5';

import FriendRequests from './components/FriendRequests';
import BlockedUsers from './components/BlockedUsers';
console.log("------------------")
//console.log(process.env)
console.log("------------------")

Modal.setAppElement('#root')
var session_token = localStorage.getItem('token');

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {},
      modalIsOpen: false
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data
    });
  }

  NavState() {
    if (session_token) {
      return <Sidebar />;
    }
    return null;
  }

  render() {
    const setBotModalIsOpen = () => {
      if (this.state.modalIsOpen) {
        this.setState({ modalIsOpen: false });
      }
      else {
        this.setState({ modalIsOpen: true });
      }

    }

    return (

      <div className="App">

        <Navbar />
        {this.NavState()}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Solution" exact component={Solution} />
          <Route path="/Services" exact component={Services} />
          <Route path="/Solution" exact component={Solution} />
          <Route path="/contact" component={Contact} />
          <Route path="/ask_reset_password/" component={AskResetPassword} />
          <Route path="/reset_password/" component={ResetPassword} />

          <Route
            path="/login"
            render={props => (
              <ContainerDM {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.loggedInStatus} />
            )}
          />
          <ProtectedRoutes path="/profile/" component={Profile} />
          <ProtectedRoutes path="/dashboard" component={Dashboard} />
          <ProtectedRoutes path="/alert/" component={AlertPage} />
          <ProtectedRoutes path="/Progression/" component={Progression} />
          <ProtectedRoutes path="/Community/" component={Community} />
          <ProtectedRoutes path="/change_password/" component={ChangePassword} />
          <ProtectedRoutes path="/MyCommunity/" component={MyCommunityOverview} />
          <ProtectedRoutes path="/user/requested_users/" component={FriendRequests} />
          <ProtectedRoutes path="/followed_users/" component={Favoris} />
          <ProtectedRoutes path="/user/blocked_users/" component={BlockedUsers} />
          <ProtectedRoutes path="/Lesson1/" component={Lesson1} />
          <ProtectedRoutes path="/Lesson2/" component={Lesson2} />
          <ProtectedRoutes path="/Lesson3/" component={Lesson3} />
          <ProtectedRoutes path="/Lesson4/" component={Lesson4} />
          <ProtectedRoutes path="/Lesson5/" component={Lesson5} />

          <div
            style={{
              position: "relative",
              top: "75px",
              left: "260px",
              width: "calc(100% - 280px)",
            }}
          >
          </div>
        </Switch>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => setBotModalIsOpen()}
          style={
            {
              overlay: {
                backgroundColor: 'rgba(255, 255, 255, 0)'
              },
              content: {
                width: '330px',
                height: '600px',
                position: 'fixed',
                top: '31%',
                left: '70%'
              }
            }

          }
        >
          <iframe src="https://web.powerva.microsoft.com/environments/Default-e094ed67-b82e-4e30-b4fe-adc1ffd3f809/bots/new_bot_4eb0011b1fb84c61ad8ce906ec0d4e3d/webchat"
            frameBorder="0" title="chatbot" height="95%" width="100%"></iframe>

        </Modal>
        <img src={BotImage} alt="" width="100px" style={{
          position: "fixed",
          top: "90%",
          left: "95%",
          width: "50px"
        }} onClick={() => setBotModalIsOpen()}></img>

      </div>
    );
  }
}
