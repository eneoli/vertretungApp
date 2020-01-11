import React from 'react';
import {Login} from "./src/components/Login";
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Plan} from "./src/components/Plan";
import {Image, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import TouchableItem from "react-navigation-stack/lib/typescript/views/TouchableItem";
import navigationService from "./src/providers/navigationService";
import {Settings} from "./src/components/Settings";

const icon = require('./assets/icon.png');


export const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Einstellungen'
    }
  },
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
      headerRight: () => <TouchableOpacity onPress={() => {
        navigationService.navigate('Settings', {});
      }
      }><FontAwesomeIcon icon={faCog} size={25} style={{margin: 10}}/></TouchableOpacity>
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