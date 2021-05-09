import {Component} from "react";
import {
  Image,
  View,
  StyleSheet,
  ImageBackground, StatusBar,
} from "react-native";
import * as React from "react";
import {FormInput} from "../FormInput/indx";
import {Button} from "../Button";
import {
  NavigationActions,
  NavigationScreenProp, StackActions
} from "react-navigation";
import {MoodleProvider} from "../../providers/moodle";
import {Loader} from "../Loader";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {Alert} from "../Alert";
import navigationService from "../../providers/navigationService";
import SplashScreen from "react-native-splash-screen";
import {encryptLogin} from "../../providers/crypto";
import {SettingsManager} from "../../providers/settings";

export interface ParamsFromLogin {
  moodleSession: string;
}

interface LoginProps {
  username: string;
  password: string;
  navigation: NavigationScreenProp<this>;
}

@observer
export class Login extends Component<LoginProps> {

  static navigationOptions = {
    header: null,
  };
  @observable
  private username: string;
  @observable
  private password: string;
  @observable
  private showLoading: boolean = false;
  @observable
  private showError: boolean = false;
  @observable
  private errorMessage: string = '';

  private settingsManager: SettingsManager;

  @action
  private handleUsernameUpdate(e: string) {
    this.username = e;
  }

  @action
  private handlePasswordUpdate(e: string) {
    this.password = e;
  }

  componentDidMount(): void {
    StatusBar.setBackgroundColor('#47698e');
    SplashScreen.hide();
  }

  constructor(props: LoginProps) {
    super(props);
    navigationService.setTopLevelNavigator(this.props.navigation);

    // auto login
    this.settingsManager = new SettingsManager();
    this.settingsManager.load().then((settings) => {
      const userAuth = settings.userAuth;
      if (userAuth) {
        this.login(userAuth);
      }
    }).catch((error) => console.error(error));
  }

  @action
  private manualLogin() {
    this.showLoading = true;
    encryptLogin(this.username, this.password)
        .then((encryptedLogin) => {
          this.login(encryptedLogin);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          this.showError = true;
          this.showLoading = false;
        });
  }

  @action
  private login(encryptedLogin: string) {
    this.showLoading = true;

    // fetch moodle session
    MoodleProvider.login(encryptedLogin).then(async (moodleSession) => {
      this.settingsManager.setUserAuth(encryptedLogin);
      await this.settingsManager.save();

      // go to plan screen with moodle session
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: 'Plan', params: {
            moodleSession: moodleSession,
          }
        })],
      });
      this.props.navigation.dispatch(resetAction);
    }).catch((error) => {
      this.errorMessage = error.message;
      this.showLoading = false;
      this.showError = true;
    });
  }

  public render() {
    return (
        <View style={styles.login}>
          <Loader visible={this.showLoading}/>
          <Alert visible={this.showError}
                 title={'Es ist ein Fehler aufgetreten'}
                 message={this.errorMessage}
                 onOkPress={() => {
                   this.showError = false
                 }}/>
          <ImageBackground style={styles.background}
                           source={require('./../../../assets/background.png')}>
            <View style={styles.container}>
              <Image source={require('../../../assets/icon.png')}
                     style={styles.logo}/>
              <View style={styles.form}>
                <FormInput autoCapitalize={'none'}
                           autoCorrect={false}
                           placeholder={'Benutzername'}
                           placeholderTextColor={'lightgrey'}
                           value={this.props.username}
                           onChangeText={this.handleUsernameUpdate.bind(this)}/>
                <FormInput placeholder={'Passwort'}
                           placeholderTextColor={'lightgrey'}
                           secureTextEntry={true}
                           value={this.props.password}
                           onChangeText={this.handlePasswordUpdate.bind(this)}/>
                <Button label={'Log In'}
                        onPress={this.manualLogin.bind(this)}/>
              </View>
            </View>
          </ImageBackground>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  login: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  background: {
    flex: 1
  },
  logo: {
    flex: 1,
    width: '35%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    height: '100%',
  }
});