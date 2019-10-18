import {Component} from "react";
import * as React from "react";
import {View, StyleSheet} from "react-native";

interface ItemProps {
  /*hour: string,
  class: string,
  subject: string,
  teacher: string,
  replacement: string,
  room: string,
  comment: string*/

}

export class Item extends Component<ItemProps> {
  public render(): React.ReactNode {
    return (
        <View style={styles.itemWrapper}>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    alignSelf: 'center',
    backgroundColor: '#1589FF',
    width: '80%',
    minHeight: 75,
    margin: 10,
  }
});