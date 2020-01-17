import React, {Component, ReactNode} from "react";
import {Text, View, StyleSheet} from "react-native";

interface PlainTextProps {
  text: string;
  prepend?: string;
}

export class PlainText extends Component<PlainTextProps> {
  static defaultProps = {
    prepend: '',
  };

  public render(): ReactNode {
    if (this.props.text) {
      return (
          <Text style={styles.text}>{this.props.prepend + this.props.text}</Text>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  text: {
    padding: 0,
    margin: 20,
    color: 'white',
  },
});