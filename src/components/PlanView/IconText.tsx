import React, {Component, ReactNode} from "react";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {Text, View, StyleSheet} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {ThemeContext} from "../themeContext/theme-context";

interface IconTextProps {
  text: string;
  icon: IconDefinition;
  text2?: IconDefinition;
}

export class IconText extends Component<IconTextProps> {

  static contextType = ThemeContext;

  private getStyles() {
    const darkMode = this.context.theme === 'dark';
    return styles(darkMode);
  }

  private getIconColor() {
    const darkMode = this.context.theme === 'dark';
    return darkMode ? 'white' : 'black';
  }

  public render(): ReactNode {
    if (!this.props.text) return null;

    if (this.props.text2) {
      return (
          <>
            <View style={{flexDirection: 'row', margin: 20, alignItems: 'center', justifyContent: 'flex-start'}}>
              <Text style={this.getStyles().text}>{this.props.text}</Text>
              <FontAwesomeIcon color={this.getIconColor()} icon={this.props.icon} size={30}/>
              <Text style={this.getStyles().text}>{this.props.text2}</Text>
            </View>
          </>
      );
    } else {
      return (
          <>
            <View style={{flexDirection: 'row', margin: 20, alignItems: 'center', justifyContent: 'flex-start'}}>
              <FontAwesomeIcon color={this.getIconColor()} icon={this.props.icon} size={30}/>
              <Text style={this.getStyles().text}>{this.props.text}</Text>
            </View>
          </>
      );
    }
  }
}

const styles = (darkMode: boolean) => StyleSheet.create({
  text: {
    padding: 5,
    margin: 10,
    fontSize: 18,
    lineHeight: 20,
    color: darkMode ? 'white' : 'black',
  }
});