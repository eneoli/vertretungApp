import {Component} from "react";
import {View, Text, Picker, AsyncStorage} from "react-native";
import * as React from 'react';
import {observable} from "mobx";
import {observer} from "mobx-react";
import {NavigationScreenProp} from "react-navigation";

interface ISettingsProps {
  navigation: NavigationScreenProp<this>;
}

@observer
export class Settings extends Component<ISettingsProps> {
  @observable
  private selectedYear: number = -1;
  @observable
  private selectedClass: string = null;
  private classes = [5, 6, 7, 8, 9, 10, 11, 12, 13];
  private classLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  constructor(props) {
    super(props);
    AsyncStorage.getItem('class').then((studentClass) => {
      this.selectedYear = parseInt(studentClass.replace(/[a-z]/g, ""), 10);
      this.selectedClass = studentClass.replace(/[0-9]/g, "");
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
    }
  }


  public render(): React.ReactNode {
    return (
        <View>
          <View>
            <Text style={{fontSize: 20, margin: 10, marginBottom: 20}}>Hier kannst du deine Klasse einstellen, damit
              eventuelle Vertretungsstunden besonders hervorgehoben werden
              und du sie so besser im Blick hast.</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Jahrgang</Text>
            <Picker selectedValue={this.selectedYear} mode={'dropdown'} prompt={'Jahrgang'}
                    onValueChange={(v) => {
                      this.selectedYear = v;
                      if (this.selectedYear > 10 || this.selectedYear == -1) {
                        this.selectedClass = null;
                      }
                    }}>
              <Picker.Item label={'Nicht angeben'} value={-1}/>
              {
                this.classes.map((i) => {
                  return <Picker.Item label={'' + i} value={i}/>
                })
              }
            </Picker>
            {
              this.selectedYear <= 10 && this.selectedYear != -1 ?
                  <View>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Klasse</Text>
                    <Picker selectedValue={this.selectedClass} mode={'dropdown'} prompt={'Klasse'}
                            onValueChange={(v) => {
                              this.selectedClass = v
                            }}>
                      {
                        this.classLetters.map((i) => {
                          return <Picker.Item label={i} value={i}/>
                        })
                      }
                    </Picker>
                  </View> : null
            }
          </View>
        </View>
    );
  }
}