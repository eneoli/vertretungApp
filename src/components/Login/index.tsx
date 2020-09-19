import {Component} from "react";
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  AsyncStorage
} from "react-native";
import * as React from "react";
import {FormInput} from "../FormInput/indx";
import {Button} from "../Button";
import {
  NavigationActions,
  NavigationScreenProp, StackActions
} from "react-navigation";
import {MoodleProvider} from "../../providers/moodle";
import * as JSEncrypt from "jsencrypt";
import {Loader} from "../Loader";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Alert} from "../Alert";
import navigationService from "../../providers/navigationService";
import SplashScreen from "react-native-splash-screen";

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

  private handleUsernameUpdate(e: string) {
    this.username = e;
  }

  private handlePasswordUpdate(e: string) {
    this.password = e;
  }

  componentDidMount(): void {
    SplashScreen.hide();
  }

  constructor(props: LoginProps) {
    super(props);
    navigationService.setTopLevelNavigator(this.props.navigation);
    AsyncStorage.getItem('userpass', (error, result) => {
      if (!error && result) {
        this.login(result);
      }
    });
  }

  private async encryptLogin(username: string, password: string): Promise<string> {
    let crypto = new JSEncrypt.JSEncrypt();
    let publicKey = await MoodleProvider.getPublicKey();
    crypto.setPublicKey(publicKey);
    return await crypto.encrypt(JSON.stringify({
      username: username,
      password: password
    }));
  }

  private manualLogin() {
    this.showLoading = true;
    this.encryptLogin(this.username, this.password).then((e) => {
      this.login(e);
    }).catch((e) => {
      this.errorMessage = e.message;
      this.showLoading = false;
      this.showError = true;
    });
  }

  private login(encrytedLogin: string) {
    this.showLoading = true;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Plan'})],
    });
    MoodleProvider.login(encrytedLogin).then((m) => {
      AsyncStorage.setItem('userpass', encrytedLogin);
      AsyncStorage.setItem('moodleSession', m);
      this.props.navigation.dispatch(resetAction);
    }).catch((e) => {
      this.errorMessage = e.message;
      this.showLoading = false;
      this.showError = true;
    });
  }

  public render() {
    return (
        <View style={styles.login}>
          <Loader visible={this.showLoading}/>
          <Alert visible={this.showError} title={'Es ist ein Fehler aufgetreten'} message={this.errorMessage}
                 onOkPress={() => {
                   this.showError = false
                 }}/>
          <ImageBackground style={styles.background} source={require('./../../../assets/background.png')}>
            <View style={styles.container}>
              <Image source={require('../../../assets/icon.png')} style={styles.logo}/>
              <View style={styles.form}>
                <FormInput autoCapitalize={'none'} autoCorrect={false} placeholder={'Benutzername'} placeholderTextColor={'lightgrey'}
                           value={this.props.username}
                           onChangeText={this.handleUsernameUpdate.bind(this)}/>
                <FormInput placeholder={'Passwort'} placeholderTextColor={'lightgrey'} secureTextEntry={true}
                           value={this.props.password} onChangeText={this.handlePasswordUpdate.bind(this)}/>
                <Button label={'Log In'} onPress={this.manualLogin.bind(this)}/>
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