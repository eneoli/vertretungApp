import {Component} from "react";
import * as React from "react";
import {View, StyleSheet, StatusBar} from "react-native";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {MoodleProvider} from "../../providers/moodle";
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

@observer
export class Plan extends Component<PlanProps> {

  static contextType = ThemeContext;

  @observable
  private readonly moodleSession: string = '';

  @observable
  private today: any = {};

  @observable
  private tomorrow: any = {};

  @observable
  private classSettings: ClassSettings = null;

  @observable
  private loading: boolean = true;

  @observable
  private index: number = 0;

  private settingsManager: SettingsManager;

  constructor(props) {
    super(props);

    this.settingsManager = new SettingsManager();
    this.moodleSession = this.props.navigation.getParam('moodleSession');

    // when coming back from settings
    // TODO conditional reload
    this.props.navigation.addListener('didFocus', async () => {
      this.loading = true;
      await this.loadPlans();
      await this.readStudentClass();
      this.loading = false;
    });

    // initially get data from moodle and get class settings
    Promise.all([
      this.loadPlans(),
      this.readStudentClass(),
    ]).then(() => {
      this.loading = false;
    }).catch((error) => console.error(error));
  }

  public componentDidMount(): void {
    StatusBar.setBackgroundColor(this.context.theme === 'light' ? '#b41019' : '#322f3d');
  }

  public async loadPlans() {
    this.today = await MoodleProvider.getPlan('today', this.moodleSession);
    this.tomorrow = await MoodleProvider.getPlan('tomorrow', this.moodleSession);
  }

  public async readStudentClass() {
    const settings = await this.settingsManager.load(); // always reload
    this.classSettings = settings.classSettings;
  }

  public render() {
    return (
        !this.loading ? (
            <View style={styles.container}>
              <TabView
                  swipeEnabled={true}
                  navigationState={{
                    index: this.index, routes: [
                      {key: 'first', title: 'Heute'},
                      {key: 'second', title: 'Morgen'}
                    ]
                  }}
                  onIndexChange={(i) => this.index = i}
                  renderTabBar={(props) => (
                      <TabBar
                          {...props}
                          style={{backgroundColor: this.context.theme == 'light' ? '#b41019' : '#322f3d'}}
                          indicatorStyle={{backgroundColor: '#FF3333'}}
                          activeColor={this.context.theme == 'light' ? 'white' : '#b41019'}
                          inactiveColor={'lightgray'}/>
                  )}
                  renderScene={SceneMap({
                    first: () => <PlanView plan={this.today}
                                           classSettings={this.classSettings}
                                           onRefresh={this.loadPlans.bind(this)}/>,
                    second: () => <PlanView plan={this.tomorrow}
                                            classSettings={this.classSettings}
                                            onRefresh={this.loadPlans.bind(this)}/>
                  })}
              />
            </View>
        ) : <Loader visible={true} background={false}/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});