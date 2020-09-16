import React, {Component, ReactNode} from 'react';
import {Login} from "./src/components/Login";
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Plan} from "./src/components/Plan";
import {AsyncStorage, Image, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import navigationService from "./src/providers/navigationService";
import {Settings} from "./src/components/Settings";
import {ThemeContext} from './src/components/themeContext/theme-context';
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {Appearance} from "react-native-appearance";

const icon = require('./assets/icon.png');


export const createNavigator = (darkMode: boolean) => createStackNavigator({
  Login: {screen: Login},
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Einstellungen',
      headerTintColor: darkMode ? 'white' : 'black',
      headerStyle: {
        backgroundColor: darkMode ? '#322f3d' : 'white',
      }
    },
  },
  Plan: {
    screen: Plan,
    navigationOptions: {
      title: 'Vertretungsstunden',
      headerTintColor: darkMode ? 'white' : 'black',
      headerStyle: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        backgroundColor: darkMode ? '#322f3d' : 'white',
      },
      headerLeft: () => (
          <View>
            <Image source={icon} style={{width: 50, height: 50}}/>
          </View>
      ),
      headerRight: () => (<TouchableOpacity onPress={() => {
            navigationService.navigate('Settings', {});
          }
          }>
            <FontAwesomeIcon icon={faCog} size={25} style={{margin: 10, color: darkMode ? 'white' : 'black'}}/>
          </TouchableOpacity>
      )
    }
  },
});

const createNavigatorStateFunction = (navigator) => {
  const defaultGetStateForAction = navigator.router.getStateForAction;
  return (action, state) => {
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
};

@observer
export default class App extends Component {

  private readonly navigator;

  @observable
  private lightMode: boolean;

  constructor(props: object) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.lightMode = colorScheme === 'light' || colorScheme === 'no-preference';
    this.navigator = createNavigator(!this.lightMode);
    this.navigator.router.getStateForAction = createNavigatorStateFunction(this.navigator);
  }

  public render(): ReactNode {
    return (
        <ThemeContext.Provider value={{
          theme: !this.lightMode ? 'dark' : 'light',
          setTheme: action((v) => {
            // todo implement
          }),
        }}>
          {
            React.createElement(createAppContainer(this.navigator))
          }
        </ThemeContext.Provider>
    );
  }
}