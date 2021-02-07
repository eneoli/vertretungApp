import {Component} from "react";
import {View, Text, AsyncStorage, StyleSheet, TouchableOpacity} from "react-native";
import * as React from 'react';
import {observable} from "mobx";
import {observer} from "mobx-react";
import {NavigationScreenProp} from "react-navigation";
import {Picker} from '@react-native-community/picker';
import {ThemeContext} from "../themeContext/theme-context";
import {Appearance} from "react-native-appearance";
import {CoursePicker} from "./course-picker";

interface ISettingsProps {
  navigation: NavigationScreenProp<this>;
}

@observer
export class Settings extends Component<ISettingsProps> {

  static contextType = ThemeContext;

  @observable
  private selectedYear: number = -1;
  @observable
  private selectedClass: string = null;
  private selectedCourses: string[] = [''];
  @observable
  private theme: string;
  private classes = [5, 6, 7, 8, 9, 10, 11, 12, 13];
  private classLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  constructor(props) {
    super(props);
    AsyncStorage.getItem('class').then((studentClass) => {
      this.selectedYear = parseInt(studentClass.replace(/[a-z]/g, ""), 10);
      this.selectedClass = studentClass.replace(/[0-9]/g, "");
    });

    AsyncStorage.getItem('courses').then((courses) => {
      if (courses) {
        this.selectedCourses = JSON.parse(courses);
      }
    });

    AsyncStorage.getItem('theme').then((theme) => {
      this.theme = theme.toString() || 'system';
    });
  }

  componentWillUnmount(): void {
    if (this.selectedYear == -1) {
      AsyncStorage.setItem('class', '');
    } else {
      if (!this.selectedClass || this.selectedYear > 10) {
        AsyncStorage.setItem('class', '' + this.selectedYear);
      } else {
        AsyncStorage.setItem('class', '' + this.selectedYear + this.selectedClass);
      }

      if (this.selectedYear > 10) {
        AsyncStorage.setItem('courses', JSON.stringify(this.selectedCourses));
      }
    }

    AsyncStorage.setItem('theme', this.theme);
    const colorScheme = Appearance.getColorScheme();
    const systemLightMode = colorScheme === 'light' || colorScheme === 'no-preference';

    if (this.theme === 'system') {
      this.context.setTheme(systemLightMode ? 'light' : 'dark');
    } else {
      this.context.setTheme(this.theme);
    }
  }

  private getStyles() {
    const darkMode = this.context.theme === 'dark';
    return StyleSheet.create({
      view: {
        backgroundColor: darkMode ? '#282c3d' : 'white',
        height: '100%'
      },
      headerText: {
        fontSize: 20,
        margin: 10,
        marginBottom: 20,
        color: darkMode ? 'white' : 'black'
      },
      fieldText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: darkMode ? 'white' : 'black',
      },
      picker: {
        color: darkMode ? 'white' : 'black',
      },
      pickerItems: {
        color: 'black',
        backgroundColor: 'red',
      }
    });
  }

  public render(): React.ReactNode {
    return (
        <View style={this.getStyles().view}>
          <Text style={this.getStyles().headerText}>Hier kannst du deine Klasse einstellen, damit
            eventuelle Vertretungsstunden besonders hervorgehoben werden
            und du sie so besser im Blick hast.</Text>
          <Text style={this.getStyles().fieldText}>Jahrgang</Text>
          <Picker selectedValue={this.selectedYear} mode={'dialog'} prompt={'Jahrgang'}
                  style={this.getStyles().picker}
                  itemStyle={this.getStyles().pickerItems}
                  onValueChange={(v) => {
                    this.selectedYear = parseInt(v.toString(), 10);
                    if (this.selectedYear > 10 || this.selectedYear == -1) {
                      this.selectedClass = null;
                    }
                  }}>
            <Picker.Item label={'Nicht angeben'} value={-1} color={this.getStyles().pickerItems.color}/>
            {
              this.classes.map((i) => {
                return <Picker.Item label={'' + i} value={i} color={this.getStyles().pickerItems.color}/>
              })
            }
          </Picker>
          {
            this.selectedYear <= 10 && this.selectedYear != -1 ?
                <View>
                  <Text style={this.getStyles().fieldText}>Klasse</Text>
                  <Picker selectedValue={this.selectedClass}
                          mode={'dialog'}
                          prompt={'Klasse'}
                          itemStyle={this.getStyles().pickerItems}
                          style={this.getStyles().picker}
                          onValueChange={(v) => {
                            this.selectedClass = v.toString();
                          }}>
                    {
                      this.classLetters.map((i) => {
                        return <Picker.Item label={i} value={i} color={this.getStyles().pickerItems.color}/>
                      })
                    }
                  </Picker>
                </View> : null
          }
          {
            this.selectedYear >= 11 && this.selectedYear != -1 && (
                <View>
                  <CoursePicker onChange={(courses) => {
                    this.selectedCourses = courses;
                  }} initialCourses={this.selectedCourses}/>
                </View>
            )
          }
          <View>
            <Text style={this.getStyles().fieldText}>Aussehen</Text>
            <Picker selectedValue={this.theme}
                    mode={'dialog'}
                    prompt={'Aussehen'}
                    style={this.getStyles().picker}
                    itemStyle={this.getStyles().pickerItems}
                    onValueChange={(v) => {
                      this.theme = v.toString();
                    }}>
              <Picker.Item label={'Systemeinstellung'} value={'system'} color={this.getStyles().pickerItems.color}/>
              <Picker.Item label={'Hell'} value={'light'} color={this.getStyles().pickerItems.color}/>
              <Picker.Item label={'Dunkel'} value={'dark'} color={this.getStyles().pickerItems.color}/>
            </Picker>
          </View>
        </View>
    );
  }
}