import {
  Alignment,
  Button,
  Classes,
  Menu,
  MenuItem,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Popover,
} from "@blueprintjs/core";
import "./Navbar.scss";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { logout } from "../store/reducers/user.reducer";

var session_token = localStorage.getItem('token');

const Sidebar = ({ pathname, push, connected }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const refreshPage = ()=>{
    window.location.reload();
  }

  return (

    <div
    className="navbar_style"
    style={{ width: "100%", height: ""}}
    tabIndex="0"
  >

      <Navbar
        className="navbar-custom"
      >

        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading
            className="D_NavbarHeading"
            active={pathname?pathname === "/":false}
            text="FMetric"
            onClick={() => history.push("/")}
            // style={{ width: "", margin: "auto", position: "" }}
          >FMetric
          </NavbarHeading>
          <NavbarDivider />
        </NavbarGroup>

        <NavbarGroup align={Alignment.CENTER}
         className="NavbarGroup_Item" >
          <MenuItem
            text="Home"
            icon="home"
            active={pathname?pathname === "/":false}
            onClick={() => history.push("/")}
          />
          <MenuItem
            text="Services"
            icon="share"
            active={pathname?pathname === "/Services":false}
            onClick={() => history.push("/Services")}
          />
          <MenuItem
            text="Contact"
            icon="map-marker"
            active={pathname?pathname === "/Contact":false}
            onClick={() => history.push("/Contact")}
          />
          <MenuItem
            text="Solution"
            icon="property"
            active={pathname?pathname === "/Solution":false}
            onClick={() => history.push("/Solution")}
          />
          <MenuItem
            className={Classes.MINIMAL}
            icon="trending-up"
            text="Progression"
            active={pathname?pathname === "/Progression":false}
            onClick={() => history.push("/Progression")}
          />
          <MenuItem
            className={Classes.MINIMAL}
            icon="people"
            text="Communauté"
            active={pathname?pathname === "/Community":false}
            onClick={() => history.push("/Community")}
          />
          <div className="NavTop">
            <Popover
              content={
                <Menu>
                  {/* Switch Login / Logout */}
                  <MenuItem text="Profile" onClick={() => push("/profile")} />
                  {
                    (session_token !== null) ?
                      <MenuItem text="Logout"
                        onClick={() => dispatch(logout())}
                      /> : <MenuItem text="Login" onClick={() => {
                        push("/login");
                        refreshPage();
                      }} />
                  }
                </Menu>
              }
            >
              <Button
                className={Classes.MINIMAL}
                outlined={true}
                icon="user"
                text="--"
                rightIcon="caret-down"
              />
            </Popover>
          </div>
        </NavbarGroup>
      </Navbar>
    </div>
  )
}

export default connect(
  (state) => ({
    pathname: state.router.location.pathname,
    connected: state.stream.connected,
  }),
  { push }
)(Sidebar);