import React from 'react';
import {Login} from "./src/components/Login";
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Plan} from "./src/components/Plan";
import {Text, Image, View} from 'react-native';
import {Icon} from "react-native-elements";

const icon = require('./assets/icon.png');


export const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Plan: {
    screen: Plan,
    navigationOptions: {
      title: 'Vertretungsstunden',
      headerStyle: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      headerLeft: () => <View><Image source={icon} style={{width: 50, height: 50}}/>
      </View>,
      headerRight: () => <Icon name={'settings'}/>
    }
  },
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