import {Component} from "react";
import {ActivityIndicator, View, StyleSheet, Modal, Animated, Easing} from "react-native";
import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ThemeContext} from "../themeContext/theme-context";

interface LoaderProps {
  visible: boolean;
  background: boolean;
}

@observer
export class Loader extends Component<LoaderProps> {

  static contextType = ThemeContext;

  static defaultProps = {
    background: true,
  };

  @observable
  private fade = new Animated.Value(0);

  componentDidMount() {
    this.spin()
  }

  private spin() {
    this.fade.setValue(0);
    Animated.timing(
        this.fade,
        {
          toValue: 1,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }
    ).start()
  }

  private getStyles(background: boolean) {

    const darkMode = this.context.theme === 'dark';

    return StyleSheet.create({
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
        backgroundColor: background ? 'rgba(0,0,0,0.5)' : (darkMode ? '#322f3d' : 'rgba(0,0,0,0)'),
        zIndex: 9999,
      }
    });
  }

  public render() {
    this.spin();
    if (this.props.visible) {
      const f = this.fade.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      });
      return (
          <Animated.View style={[{opacity: f}, this.getStyles(this.props.background).modalBackground]}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size={"large"} color={'#FF3333'}/>
            </View>
          </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 75,
    width: 125,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});