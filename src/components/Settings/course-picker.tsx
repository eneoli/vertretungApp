import React, {Component, ReactNode} from "react";
import {View, Text, TextInput, TextInputChangeEventData, NativeSyntheticEvent, StyleSheet} from "react-native";
import {ThemeContext} from "../themeContext/theme-context";
import _ from "lodash";

interface CoursePickerProps {
  initialCourses: string[];
  onChange: (courses: string[]) => void;
}

interface CoursePickerState {
  courses: string[];
}

export class CoursePicker extends Component<CoursePickerProps, CoursePickerState> {

  static contextType = ThemeContext;

  constructor(props: any) {
    super(props);
    this.state = {
      courses: ['']
    }
  }

  public onInput(index: number, text: string) {
    this.state.courses[index] = text;

    let shouldRemove: number[] = [];
    for (let i = 1; i < this.state.courses.length; i++) {
      if (!this.state.courses[i].trim()) {
        shouldRemove.push(i);
      }
    }

    for (let i = shouldRemove.length - 1; i >= 0; i--) {
      this.state.courses.splice(shouldRemove[i], 1);
    }

    if (this.state.courses[this.state.courses.length - 1].trim()) {
      this.state.courses.push('');
    }

    this.setState({
      courses: this.state.courses
    })

    this.props.onChange(this.state.courses.filter(e => e.trim()));
  }

  private getStyles() {
    const darkMode = this.context.theme === 'dark';
    return StyleSheet.create({
      view: {
        width: '100%',
      },
      input: {
        color: darkMode ? 'white' : 'black',
      },
      text: {
        fontSize: 18,
        color: darkMode ? 'white' : 'black',
      }
    });
  }

  public componentDidUpdate(prevProps: Readonly<CoursePickerProps>, prevState: Readonly<CoursePickerState>, snapshot?: any) {
    if (!_.eq(this.props.initialCourses, prevProps.initialCourses)) {
      const initialCourses = [...this.props.initialCourses];

      if (initialCourses[initialCourses.length - 1].trim()) {
        initialCourses.push('');
      }

      this.setState({
        courses: initialCourses,
      })
    }
  }

  public render(): ReactNode {
    return (
        <View style={this.getStyles().view}>
          {
            this.state.courses.map((e, i) => (
                <View>
                  <Text style={this.getStyles().text}>Kurs:</Text>
                  <TextInput style={this.getStyles().input}
                             onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
                               this.onInput(i, event.nativeEvent.text)
                             }
                             } value={e}/>
                </View>
            ))
          }
        </View>
    );
  }
}