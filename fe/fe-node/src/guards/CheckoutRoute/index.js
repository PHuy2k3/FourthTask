import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckoutRoute(props) { 
  const { currentUser } = useSelector((state) => state.authReducer);
  const { component: BookTicket, ...routeProps } = props;
  return (
    <Route {...routeProps} render={(propsInRoute) => {
      if (currentUser) {
        return <BookTicket {...propsInRoute} />
      }
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: propsInRoute.location.state
          }}
        />
      )
    }} />
  )
}
export default CheckoutRoute;