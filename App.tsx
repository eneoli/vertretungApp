import React from 'react';
import {Login} from "./src/components/Login";
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Plan} from "./src/components/Plan";


const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Plan: {screen: Plan},
});

const defaultGetStateForAction = MainNavigator.router.getStateForAction;
MainNavigator.router.getStateForAction = (action, state) => {
  if (
      state &&
      action.type === NavigationActions.BACK &&
      (
          state.routes[state.index].routeName === 'Login' ||
          state.routes[state.index].routeName === 'Main'
      )
  ) {
    // Returning null indicates stack end, and triggers exit
    return null;
  }
  return defaultGetStateForAction(action, state);
};

const App = createAppContainer(MainNavigator);

export default App;