// TODO web alert

import {Component} from "react";
import {Alert as ReactAlert, StyleSheet, View, Text} from 'react-native';
import * as React from "react";
import {Button} from "react-native-elements";

interface AlertProps {
  title: string;
  message: string;
  visible: boolean;
  onOkPress: () => void;

}

export class Alert extends Component<AlertProps> {
  public render(): React.ReactNode {
    if (this.props.visible) {
      if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') { // IOS Android
        ReactAlert.alert(
            this.props.title,
            this.props.message,
            [
              {text: 'OK', onPress: this.props.onOkPress},
            ],
            {cancelable: false},
        );
        return null;
      } else { // web
        return (
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <Text style={styles.titleText}>{this.props.title}</Text>
                <Text style={styles.messageText}>{this.props.message}</Text>
                <View style={{marginLeft: 'auto'}}>
                  <Button title={'OK'} type={'clear'} style={styles.okButton} onPress={this.props.onOkPress}/>
                </View>
              </View>
            </View>
        );
      }
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    display: 'flex',
    padding: '20px',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  titleText: {
    marginRight: 'auto',
    padding: '5px',
    paddingBottom: '20px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  messageText: {
    marginRight: 'auto',
    padding: '5px',
    paddingBottom: '20px',
    textAlign: 'left',
  },
  okButton: {
    padding: 0,
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginLeft: 'auto',
  }
});