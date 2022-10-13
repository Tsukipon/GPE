import { Route, Redirect } from "react-router-dom";

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ component: Component, ...rest }) {
  return (
    // this route takes other route assigned to it from the App.js and return the same route if condition is met
    <Route
      {...rest}
      render={(props) => {
        const token = localStorage.getItem('localToken');
         console.log("Token en cour:",localStorage.getItem('localToken'));
        if (token) {
          console.log("Vous pouvez acceder à la page !!");
          return <Component {...props} />;
        } else {
          console.log("Vous ne pouvez pas accede à la page vous devez vous connecter avant");
          // return the user to the landing page if there is no valid token set
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  // sets the location a user was about to assess before being redirected to login
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
}
