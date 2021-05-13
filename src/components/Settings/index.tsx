import {Component} from "react";
import {View, Text, StyleSheet} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import {Picker} from "@react-native-picker/picker";
import * as React from 'react';
import {observable} from "mobx";
import {observer} from "mobx-react";
import {NavigationScreenProp} from "react-navigation";
import {ThemeContext} from "../themeContext/theme-context";
import {Appearance} from "react-native-appearance";
import {CoursePicker} from "./course-picker";
import {AppContext, AppTheme, SettingsManager} from "../../providers/settings";
import {NotificationManager} from "../../notifications/NotificationManager";
import {v4} from 'uuid';

interface ISettingsProps {
  navigation: NavigationScreenProp<this>;
}

@observer
export class Settings extends Component<ISettingsProps> {

  static contextType = ThemeContext;

  @observable
  private isInitialized: boolean = false;

  @observable.deep
  private settings: AppContext;

  private settingsManager: SettingsManager;

  private notificationManager: NotificationManager;

  private classes = [5, 6, 7, 8, 9, 10, 11, 12, 13];

  private classLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  constructor(props) {
    super(props);
    this.notificationManager = new NotificationManager();
    this.settingsManager = new SettingsManager();

    this.settingsManager.load().then((settings) => {
      this.settings = settings;
      this.isInitialized = true;
    });
  }

  componentWillUnmount(): void {
    this.settingsManager.setSettings(this.settings);
    this.settingsManager.save();

    const colorScheme = Appearance.getColorScheme();
    const systemLightMode = colorScheme === 'light' || colorScheme === 'no-preference';

    if (this.settings.theme === 'system') {
      this.context.setTheme(systemLightMode ? 'light' : 'dark');
    } else {
      this.context.setTheme(this.settings.theme);
    }
  }

  private getStyles() {
    const darkMode = this.context.theme === 'dark';
    return StyleSheet.create({
      view: {
        backgroundColor: darkMode ? '#282c3d' : 'white',
        height: '100%',
        padding: 10,
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
      },
      checkboxContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        width: '100%',
        margin: 10,
      },
      checkboxText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: darkMode ? 'white' : 'black',
        marginTop: 5,
      },
    });
  }

  private onGradeChange(grade: number) {
    if (grade === null) {
      this.settings.classSettings.grade = null;
    } else {
      this.settings.classSettings.grade = grade;
    }
  }

  private onClassChange(className: string) {
    this.settings.classSettings.className = className;
  }

  private onCourseChange(courses: string[]) {
    this.settings.classSettings.courses = [...courses];
  }

  private onThemeChange(theme: string) {
    this.settings.theme = theme as AppTheme;
  }

  private onToggleNotifications() {
    this.settings.pushNotifications = !this.settings.pushNotifications;

    if (this.settings.pushNotifications) {
      this.notificationManager.start().catch((error) => console.error(error));
    } else {
      this.notificationManager.stop().catch((error) => console.error(error));
    }
  }

  public render(): React.ReactNode {

    if (!this.isInitialized) {
      return null;
    }

    return (
        <View style={this.getStyles().view}>
          <Text style={this.getStyles().headerText}>Hier kannst du deine Klasse einstellen, damit
            eventuelle Vertretungsstunden besonders hervorgehoben werden
            und du sie so besser im Blick hast.</Text>
          <Text style={this.getStyles().fieldText}>Jahrgang</Text>
          <Picker selectedValue={this.settings.classSettings.grade}
                  mode={'dialog'}
                  prompt={'Jahrgang'}
                  style={this.getStyles().picker}
                  itemStyle={this.getStyles().pickerItems}
                  onValueChange={(value) => this.onGradeChange((value && parseInt(value.toString(), 10)) || null)}>
            <Picker.Item label={'Nicht angeben'} value={null} color={this.getStyles().pickerItems.color}/>
            {
              this.classes.map((i) => {
                return <Picker.Item key={v4()} label={'' + i} value={i} color={this.getStyles().pickerItems.color}/>
              })
            }
          </Picker>
          {
            this.settings.classSettings.grade <= 10 && this.settings.classSettings.grade != null ?
                <View>
                  <Text style={this.getStyles().fieldText}>Klasse</Text>
                  <Picker mode={'dialog'}
                          prompt={'Klasse'}
                          itemStyle={this.getStyles().pickerItems}
                          style={this.getStyles().picker}
                          selectedValue={this.settings.classSettings.className}
                          onValueChange={(value) => this.onClassChange((value && value.toString()) || null)}>
                    <Picker.Item label={'Nicht angeben'} value={null} color={this.getStyles().pickerItems.color}/>
                    {
                      this.classLetters.map((i) => {
                        return <Picker.Item key={v4()} label={i} value={i} color={this.getStyles().pickerItems.color}/>
                      })
                    }
                  </Picker>
                </View> : null
          }
          {
            this.settings.classSettings.grade >= 11 && (
                <View>
                  <CoursePicker onChange={this.onCourseChange.bind(this)}
                                initialCourses={this.settings.classSettings.courses ? [...this.settings.classSettings.courses] : []}/>
                </View>
            )
          }
          <View style={this.getStyles().checkboxContainer} onTouchEnd={this.onToggleNotifications.bind(this)}>
            <CheckBox value={this.settings.pushNotifications}/>
            <Text style={this.getStyles().checkboxText}>Push-Benachrichtigungen</Text>
          </View>
          <View>
            <Text style={this.getStyles().fieldText}>Aussehen</Text>
            <Picker mode={'dialog'}
                    prompt={'Aussehen'}
                    style={this.getStyles().picker}
                    itemStyle={this.getStyles().pickerItems}
                    selectedValue={this.settings.theme}
                    onValueChange={(value) => this.onThemeChange(value.toString())}>
              <Picker.Item label={'Systemeinstellung'} value={'system'} color={this.getStyles().pickerItems.color}/>
              <Picker.Item label={'Hell'} value={'light'} color={this.getStyles().pickerItems.color}/>
              <Picker.Item label={'Dunkel'} value={'dark'} color={this.getStyles().pickerItems.color}/>
            </Picker>
          </View>
        </View>
    );
  }
}