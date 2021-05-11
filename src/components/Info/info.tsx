import React, {Component, ReactNode} from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Linking
} from "react-native";
import DeviceInfo from 'react-native-device-info'

interface InfoProps {
  onClose: () => void;
}

export class Info extends Component<InfoProps> {

  public componentDidMount() {
    StatusBar.setBackgroundColor('#47698e', true);
  }

  private async openHomepage() {
    await Linking.openURL('https://leoninum.org');
  }

  public render(): ReactNode {
    return (
        <Modal visible={true} transparent={true} animationType={"slide"} animated={true}
               onRequestClose={this.props.onClose}>
          <ImageBackground style={{flex: 1}} source={require('./../../../assets/background.png')}>
            <View style={styles.container}>
              <Text style={styles.header}>Vertretungsplan App Gymnasium Leoninum Handrup</Text>
              <TouchableOpacity onPress={this.openHomepage.bind(this)}>
                <Image source={require('../../../assets/icon.png')} style={styles.logo}/>
              </TouchableOpacity>
              <Text style={styles.text}>App-Version: {DeviceInfo.getVersion()}</Text>
              <Text style={styles.text}>Entwickelt von Oliver Enes (oliverenes01@gmail.com) im Auftrag des
                Schülerrates</Text>
            </View>
          </ImageBackground>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
  }
});