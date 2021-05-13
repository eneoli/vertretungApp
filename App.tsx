import React, {Component, ReactNode} from 'react';
import {createAppContainer} from 'react-navigation';
import {StatusBar} from 'react-native';
import {ThemeContext, ThemeType} from './src/components/themeContext/theme-context';
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {Appearance} from "react-native-appearance";
import {createNavigator} from "./src/components/navigator/create-navigator";
import {AppContext, AppTheme, SettingsManager} from "./src/providers/settings";
import {NotificationManager} from "./src/notifications/NotificationManager";

@observer
export default class App extends Component {

  @observable
  private navigator;

  @observable
  private isInitialized: boolean = false;

  @observable
  private themeType: ThemeType;

  private settingsManager: SettingsManager;

  private notificationManager: NotificationManager;

  constructor(props: object) {
    super(props);
    this.settingsManager = new SettingsManager();
    this.notificationManager = new NotificationManager();
    this.settingsManager.load().then(async (settings: AppContext) => {
      const theme = settings.theme;
      const newThemeType = App.getThemeType(theme);
      this.updateThemeType(newThemeType);
      this.isInitialized = true;

      if (settings.pushNotifications) {
        // restart notifications
        await this.notificationManager.start();
      }
    })
  }

  private static getThemeType(theme: AppTheme) {
    let newTheme;
    // get theme type from system
    if (theme === AppTheme.SYSTEM) {
      const colorScheme = Appearance.getColorScheme();
      newTheme = (colorScheme === 'light' || colorScheme === 'no-preference') ? 'light' : 'dark';
    } else { // user set theme
      newTheme = theme; // light or dark
    }
    return newTheme;
  }

  @action
  private updateThemeType(newThemeType: ThemeType) {
    this.themeType = newThemeType;
    this.navigator = createNavigator(this.themeType);
  }

  public async componentWillUnmount() {
  }

  public componentDidMount() {
    // set color for login screen
    StatusBar.setBackgroundColor('#496c92');
  }

  public render(): ReactNode {
    if (!this.isInitialized) {
      return null;
    }
    return (
        <ThemeContext.Provider value={{
          theme: this.themeType,
          setTheme: action((newThemeType) => {
            if (this.themeType !== newThemeType) {
              this.updateThemeType(newThemeType);
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