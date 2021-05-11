import {createStackNavigator} from "react-navigation-stack";
import {Login} from "../Login";
import {Settings} from "../Settings";
import {Plan} from "../Plan";
import React, {useState} from "react";
import {Image, StatusBar, TouchableOpacity, View} from "react-native";
import {Info} from "../Info/info";
import navigationService from "../../providers/navigationService";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import {NavigationActions} from "react-navigation";
import {ThemeType} from "../themeContext/theme-context";

const icon = require('../../../assets/icon.png');

function createCustomNavigatorStateFunction(navigator, ignoredRoutes: string[]) {
  const defaultGetStateForAction = navigator.router.getStateForAction;
  return (action, state) => {

    // intercept exit logic
    if (state && action.type === NavigationActions.BACK) {
      let shouldIgnore = false;
      for (const ignoredRoute of ignoredRoutes) {
        if (state.routes[state.index].routeName === ignoredRoute) {
          shouldIgnore = true;
          break;
        }
      }

      if (shouldIgnore) {
        // Returning null indicates stack end, and triggers exit
        return null;
      }
    }
    return defaultGetStateForAction(action, state);
  };
}

export function createNavigator(theme: ThemeType) {

  const darkMode = theme !== 'light';

  const navigator = createStackNavigator({
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
                        StatusBar.setBackgroundColor(darkMode ? '#322f3d' : '#b41019', true);
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
  })
  navigator.router.getStateForAction = createCustomNavigatorStateFunction(navigator, ['Login', 'Main']);

  return navigator;
}