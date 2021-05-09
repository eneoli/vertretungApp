import {AsyncStorage} from "react-native";
import _ from "lodash";

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface ClassSettings {
  grade: number | null;
  className: string | null;
  courses: string[] | null;
}

export interface AppContext {
  userAuth: string | null;
  theme: AppTheme | null;
  classSettings: ClassSettings;
  pushNotifications: boolean;
}

const defaultSettings: AppContext = {
  userAuth: null,
  classSettings: {
    className: null,
    courses: null,
    grade: null,
  },
  pushNotifications: false,
  theme: AppTheme.SYSTEM,
}

const STORAGE_KEY = 'VP_LEO_STORAGE';


export class SettingsManager {

  private settings: AppContext;

  public async load(): Promise<AppContext> {
    const serializedData = await AsyncStorage.getItem(STORAGE_KEY);
    let loadedSettings = {};
    if (serializedData) {
      loadedSettings = JSON.parse(serializedData);
    }

    this.settings = _.defaultsDeep(loadedSettings, defaultSettings);

    return this.settings;
  }

  public async save(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
  }

  public getSettings(): AppContext {
    return this.settings;
  }

  public setTheme(theme: AppTheme): void {
    this.settings.theme = theme;
  }

  public setUserAuth(userAuth: string): void {
    this.settings.userAuth = userAuth;
  }

  public setClassSettings(classSettings: ClassSettings): void {
    this.settings.classSettings = classSettings;
  }

  public setPushNotifications(pushNotifications: boolean): void {
    this.settings.pushNotifications = pushNotifications;
  }
}