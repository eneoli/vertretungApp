import {Component} from "react";
import {StyleSheet, TextInput, TextInputProps} from "react-native";
import * as React from "react";

type FormInputProps = TextInputProps;

export class FormInput extends Component<FormInputProps> {

  public render() {
    const {style, ...otherProps} = this.props;
    return (
        <TextInput style={inputStyle.textInput} {...otherProps}/>
    );
  }
}

const inputStyle = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'silver',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    color: 'white',
  }
});