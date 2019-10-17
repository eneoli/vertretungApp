import {Component} from "react";
import * as React from "react";
import {View, Text, AsyncStorage} from "react-native";
import {observer} from "mobx-react";
import {observable} from "mobx";
@observer
export class Plan extends Component {
  @observable
  private moodleSession: string = '';

  constructor() {
    super({});
    AsyncStorage.getItem('moodleSession').then((m) => {
      this.moodleSession = m;
    })
  }

  public render() {
    return (<View><Text>{this.moodleSession}</Text></View>);
  }
}