import React, {Component, ReactNode} from "react";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {Text, View, StyleSheet} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

interface IconTextProps {
  text: string;
  icon: IconDefinition;
  text2?: IconDefinition;
}

export class IconText extends Component<IconTextProps> {
  public render(): ReactNode {
    if (!this.props.text) return null;

    if (this.props.text2) {
      return (
          <>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Text style={styles.text}>{this.props.text}</Text>
              <FontAwesomeIcon icon={this.props.icon} size={30}/>
              <Text style={styles.text}>{this.props.text2}</Text>
            </View>
          </>
      );
    } else {
      return (
          <>
            <View style={{flexDirection: 'row', margin: 10}}>
              <FontAwesomeIcon icon={this.props.icon} size={30}/>
              <Text style={styles.text}>{this.props.text}</Text>
            </View>
          </>
      );
    }
  }
}

const styles = StyleSheet.create({
  text: {
    padding: 5,
    margin: 10,
    fontSize: 18,
    lineHeight: 18,
    color: 'black',
  }
});