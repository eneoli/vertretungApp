import {Component, ReactNode} from "react";
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import moment from 'moment';
import 'moment/locale/de'
import {ThemeContext} from "../themeContext/theme-context";

interface IInfoHeaderProps {
  missingTeachers: any;
  usedTeachers: any;
  day: string;
}

export class InfoHeader extends Component<IInfoHeaderProps> {

  static contextType = ThemeContext;

  constructor(props: IInfoHeaderProps) {
    super(props);
    moment.locale('de');
  }

  private getStyles() {
    return getStyles(this.context.theme === 'dark');
  }

  public render(): ReactNode {
    return (
        <View style={this.getStyles().root}>
          <Text
              style={this.getStyles().dayText}>{moment(this.props.day).format('dddd, DD.MM')}</Text>
          <Text style={this.getStyles().boldText}>Fehlende Lehrer:</Text>
          <Text style={this.getStyles().normalText}>{this.props.missingTeachers}</Text>
          <Text style={this.getStyles().boldText}>Verplante Lehrer:</Text>
          <Text style={this.getStyles().normalText}>{this.props.usedTeachers}</Text>
        </View>
    );
  }
}

const getStyles = (darkMode: boolean) => {
  return StyleSheet.create({
    root: {
      margin: 15,
      padding: 15,
    },
    boldText: {
      fontWeight: 'bold',
      color: darkMode ? 'white' : 'black'
    },
    dayText: {
      marginBottom: 10,
      fontSize: 20,
      fontWeight: 'bold',
      color: darkMode ? 'white' : 'black'
    },
    normalText: {
      color: darkMode ? 'white' : 'black',
    }
  });
};