import {Component} from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import * as React from "react";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export class Button extends Component<ButtonProps> {
  public render(): React.ReactNode {
    return (
        <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
          <Text style={styles.text}>{this.props.label}</Text>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3333',
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Sans',
    fontWeight: 'bold',
    height: 20,
  }
});