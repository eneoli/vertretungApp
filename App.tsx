import React, {Component, ReactNode, useState} from 'react';
import {Login} from "./src/components/Login";
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Plan} from "./src/components/Plan";
import {
  AsyncStorage,
  Image,
  StatusBar,
  TouchableOpacity,
  View
} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import navigationService from "./src/providers/navigationService";
import {Settings} from "./src/components/Settings";
import {ThemeContext} from './src/components/themeContext/theme-context';
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {Appearance} from "react-native-appearance";
import _ from 'lodash';
import {Info} from "./src/components/Info/info";

const icon = require('./assets/icon.png');


export const createNavigator = (darkMode: boolean) => createStackNavigator({
  Login: {screen: Login},
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Einstellungen',
      headerTintColor: darkMode ? 'white' : 'white',
      headerStyle: {
        backgroundColor: darkMode ? '#322f3d' : '#b41019',
      }
    },
  },
  Plan: {
    screen: Plan,
    navigationOptions: {
      title: 'Vertretungsstunden',
      headerTintColor: darkMode ? 'white' : 'white',
      headerStyle: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        backgroundColor: darkMode ? '#322f3d' : '#b41019',
      },
      headerTitleContainerStyle: {
        justifyContent: 'center',
      },
      headerLeft: () => {
        let [visible, setVisible] = useState(false);
        return (
            <View>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Image source={icon} style={{width: 40, height: 40, margin: 5}}/>
              </TouchableOpacity>
              {
                visible && (
                    <Info onClose={() => {
                      setVisible(false);
                    }}/>
                )
              }
            </View>
        );
      },
      headerRight: () => (<TouchableOpacity onPress={() => {
            navigationService.navigate('Settings', {});
          }
          }>
            <FontAwesomeIcon icon={faCog} size={25} style={{margin: 10, color: 'white'}}/>
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

  @observable
  private navigator;

  @observable
  private lightMode: boolean;

  constructor(props: object) {
    super(props);
    AsyncStorage.getItem('theme').then((theme) => {
      if (theme === 'system') {
        const colorScheme = Appearance.getColorScheme();
        this.lightMode = colorScheme === 'light' || colorScheme === 'no-preference';
      } else {
        this.lightMode = (theme === 'light');
      }

      this.navigator = createNavigator(!this.lightMode);
      this.navigator.router.getStateForAction = createNavigatorStateFunction(this.navigator);
    });

    this.navigator = createNavigator(!this.lightMode);
    this.navigator.router.getStateForAction = createNavigatorStateFunction(this.navigator);
  }

  public render(): ReactNode {
    if (_.isUndefined(this.lightMode)) {
      return null;
    }
    return (
        <ThemeContext.Provider value={{
          theme: !this.lightMode ? 'dark' : 'light',
          setTheme: action((v) => {
            if (this.lightMode !== (v === 'light')) {
              StatusBar.setBackgroundColor('#000000');
              this.lightMode = (v === 'light');
              this.navigator = createNavigator(!this.lightMode);
              this.navigator.router.getStateForAction = createNavigatorStateFunction(this.navigator);
            }
          }),
        }}>
          {
            React.createElement(createAppContainer(this.navigator))
          }
        </ThemeContext.Provider>
    );
  }
}