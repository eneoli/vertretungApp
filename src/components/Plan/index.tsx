import {Component} from "react";
import * as React from "react";
import {View, StyleSheet, StatusBar} from "react-native";
import {observer} from "mobx-react";
import {action} from "mobx";
import {MoodleProvider, SubstitutionPlan} from "../../providers/moodle";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {PlanView} from "../PlanView";
import {NavigationScreenProp} from "react-navigation";
import {Loader} from "../Loader";
import {ThemeContext} from "../themeContext/theme-context";
import {ParamsFromLogin} from "../Login";
import {ClassSettings, SettingsManager} from "../../providers/settings";

interface PlanProps {
  navigation: NavigationScreenProp<this, ParamsFromLogin>;
}

interface PlanState {
  moodleSession: string;
  today: SubstitutionPlan;
  tomorrow: SubstitutionPlan;
  classSettings: ClassSettings;
  loading: boolean;
  index: number;
}

@observer
export class Plan extends Component<PlanProps, PlanState> {

  static contextType = ThemeContext;

  private settingsManager: SettingsManager = new SettingsManager();

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      classSettings: null,
      loading: true,
      moodleSession: null,
      today: null,
      tomorrow: null,
    };
  }

  @action
  private async loadPlans() {
    const today = await MoodleProvider.getPlan('today', this.state.moodleSession);
    const tomorrow = await MoodleProvider.getPlan('tomorrow', this.state.moodleSession);

    this.setState({
      ...this.state,
      today: today,
      tomorrow: tomorrow,
    });
  }

  private async readStudentClass() {
    const settings = await this.settingsManager.load(); // always reload
    this.setState({
      ...this.state,
      classSettings: settings.classSettings,
    });
  }

  private async onRefresh(done: () => void) {
    await this.loadPlans();
    done();
  }

  private getStyles() {
    const darkMode = this.context.theme === 'dark';

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: darkMode ? '#282c3d' : 'white',
      }
    });
  }

  public async componentDidMount(): Promise<void> {
    StatusBar.setBackgroundColor(this.context.theme === 'light' ? '#b41019' : '#322f3d');

    this.setState({
      ...this.state,
      moodleSession: this.props.navigation.getParam('moodleSession'),
    });

    // when coming back from settings
    // TODO conditional reload
    this.props.navigation.addListener('didFocus', async () => {
      this.setState({
        ...this.state,
        loading: true,
      });

      await this.loadPlans();
      await this.readStudentClass();

      this.setState({
        ...this.state,
        loading: false,
      });
    });

    // initially get data from moodle and get class settings
    await this.loadPlans();
    await this.readStudentClass();

    this.setState({
      ...this.state,
      loading: false,
    });
  }

  public render() {

    if (this.state.loading) {
      return (
          <Loader visible={true} background={false}/>
      )
    }

    return (
        <View style={this.getStyles().container}>
          <TabView
              swipeEnabled={true}
              navigationState={{
                index: this.state.index, routes: [
                  {key: 'first', title: 'Heute'},
                  {key: 'second', title: 'Morgen'}
                ]
              }}
              onIndexChange={(i) => this.setState({
                ...this.state,
                index: i,
              })}
              renderTabBar={(props) => (
                  <TabBar
                      {...props}
                      style={{backgroundColor: this.context.theme == 'light' ? '#b41019' : '#322f3d'}}
                      indicatorStyle={{backgroundColor: '#FF3333'}}
                      activeColor={this.context.theme == 'light' ? 'white' : '#b41019'}
                      inactiveColor={'lightgray'}/>
              )}
              renderScene={SceneMap({
                first: () => <PlanView plan={this.state.today}
                                       classSettings={this.state.classSettings}
                                       onRefresh={this.onRefresh.bind(this)}/>,
                second: () => <PlanView plan={this.state.tomorrow}
                                        classSettings={this.state.classSettings}
                                        onRefresh={this.onRefresh.bind(this)}/>
              })}
          />
        </View>
    )
  }
}