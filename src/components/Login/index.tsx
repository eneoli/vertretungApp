import {Component, SyntheticEvent} from "react";
import {
  Image,
  TextInput,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Modal, Alert, AsyncStorage
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

  private handleUsernameUpdate(e: string) {
    this.username = e;
  }

  private handlePasswordUpdate(e: string) {
    this.password = e;
    console.log(e);
  }

  private async encryptLogin(username: string, password: string) {
    let crypto = new JSEncrypt.JSEncrypt();
    let publicKey = await MoodleProvider.getPublicKey();
    crypto.setPublicKey(publicKey);
    return await crypto.encrypt(JSON.stringify({
      username: username,
      password: password
    }));
  }

  public render() {
    return (
        <View style={{width: '100%', height: '100%'}}>
          <Loader visible={this.showLoading}/>
          <ImageBackground style={{flex: 1}} source={require('./../../../assets/background.png')}>
            <View style={styles.container}>
              <Image source={require('./../../../assets/icon.png')} style={styles.logo}/>
              <View style={styles.form}>
                <FormInput placeholder={'Benutzername'} placeholderTextColor={'lightgrey'} value={this.props.username}
                           onChangeText={this.handleUsernameUpdate.bind(this)}/>
                <FormInput placeholder={'Passwort'} placeholderTextColor={'lightgrey'} secureTextEntry={true}
                           value={this.props.password} onChangeText={this.handlePasswordUpdate.bind(this)}/>
                <Button label={'Log In'} onPress={() => {
                  this.showLoading = true;
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'Plan'})],
                  });
                  this.encryptLogin(this.username, this.password).then((e) => {
                    MoodleProvider.login(e).then((m) => {
                      AsyncStorage.setItem('moodleSession', m);
                      this.props.navigation.dispatch(resetAction);
                    }).catch((e) => {
                      Alert.alert(
                          'Alert Title',
                          'My Alert Msg',
                          [
                            {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          {cancelable: false},
                      );
                      this.showLoading = false;
                    })
                  });
                }}/>
              </View>
            </View>
          </ImageBackground>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: '50%',
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