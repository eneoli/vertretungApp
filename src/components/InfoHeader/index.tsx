import {Component, ReactNode} from "react";
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import moment from 'moment';
import 'moment/locale/de'

interface IInfoHeaderProps {
  missingTeachers: any;
  usedTeachers: any;
  day: Date;
}

export class InfoHeader extends Component<IInfoHeaderProps> {
  constructor(props: IInfoHeaderProps) {
    super(props);
    moment.locale('de');
  }
  public render(): ReactNode {
    return (
        <View style={styles.root}>
          <Text style={styles.dayText}>{moment(this.props.day).format('dddd, DD.MM')}</Text>
          <Text style={styles.boldText}>Fehlende Lehrer:</Text>
          <Text>{this.props.missingTeachers}</Text>
          <Text style={styles.boldText}>Verplante Lehrer:</Text>
          <Text>{this.props.usedTeachers}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    margin: 15,
    padding: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  dayText: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  }
});