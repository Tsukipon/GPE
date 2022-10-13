import {
  // Alignment,
  // Button,
  // Classes,
  Colors,
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  // Navbar,
  // NavbarGroup,
  // NavbarHeading,
  // Popover,
} from "@blueprintjs/core";
import "./Sidebar.scss";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const Sidebar = ({ pathname, push, connected }) => {
  const history = useHistory();
  return (
    // <div>
    <div
      className="bp3-drawer bp3-overlay-appear-done bp3-overlay-enter-done bp3-position-left"
      style={{ width: "10%", height: "calc(100vh - 50px)" }}
      tabIndex="0"
    >
      <div className="bp3-drawer-body">
        <Menu>
          <MenuDivider title={"Dashboard"} />
          <MenuItem
            text="Mon dashboard"
            active={pathname?pathname === "/dashboard":false}
            onClick={() => history.push("/dashboard")}
          />
          <MenuDivider title={"Alertes"} />
          <MenuItem
            text="Mes alertes"
            active={pathname?pathname === "/alert":false}
            onClick={() => history.push("/alert")}
          />
          <MenuItem
            text="Nouvelle alerte"
            active={pathname?pathname === "/alert/add":false}
            onClick={() => history.push("/alert/add")}

          />
          <MenuDivider title={"Sociale"} />
          {/* <MenuItem
              text="Mon profil"
              active={pathname === "/user/follower_requests"}
              onClick={() => history.push("/user/follower_requests")}
            /> */}
          <MenuItem
            text="Ma communauté"
            active={pathname?pathname === "/MyCommunity":false}
            onClick={() => history.push("/MyCommunity")}

          />
          <MenuItem
            text="Demandes d'ami"
            active={pathname?pathname === "/user/requested_users":false}
            onClick={() => history.push("/user/requested_users")}
          />
          <MenuItem
            text="Utilisateurs bloqués"
            active={pathname?pathname === "/user/blocked_users":false}
            onClick={() => history.push("/user/blocked_users")}
          />
          <MenuItem
            text="Utilisateurs favoris"
            active={pathname?pathname === "/followed_users/":false}
            onClick={() => history.push("/followed_users/")}
          />
        </Menu>
      </div>
      <div
        className="bp3-drawer-footer"
        style={{ color: connected ? Colors.GREEN1 : Colors.RED1 }}
      >
        <Icon icon="record" /> {connected ? "Connected" : "Disconnected"}
      </div>
    </div>
    // </div>
  )
}

export default connect(
  (state) => ({
    pathname: state.router.location.pathname,
    connected: state.stream.connected,
  }),
  { push }
)(Sidebar);
