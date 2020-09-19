import {Component} from "react";
import * as React from "react";
import {View, AsyncStorage, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {MoodleProvider} from "../../providers/moodle";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {PlanView} from "../PlanView";
import {NavigationScreenProp} from "react-navigation";
import {Loader} from "../Loader";
import {ThemeContext} from "../themeContext/theme-context";

interface IPlanProps {
  navigation: NavigationScreenProp<this>;
}

@observer
export class Plan extends Component<IPlanProps> {

  static contextType = ThemeContext;

  @observable
  private moodleSession: string = '';
  @observable
  private today: any = {};
  @observable
  private tomorrow: any = {};
  @observable
  private studentClass: any = {};
  @observable
  private loading: boolean = true;

  @observable
  private index: number = 0;

  constructor(props) {
    super(props);
    this.props.navigation.addListener('didFocus', async () => {
      this.loading = true;
      await this.loadPlans();
      await this.readStudentClass();
      this.loading = false;
    });
    this.loading = true;
    this.loadPlans();
    this.readStudentClass();
    this.loading = false;
  }

  public async loadPlans() {
    this.moodleSession = await AsyncStorage.getItem('moodleSession');
    this.today = await MoodleProvider.getPlan('today', this.moodleSession);
    this.tomorrow = await MoodleProvider.getPlan('tomorrow', this.moodleSession);
  }

  public async readStudentClass() {
    this.studentClass = await AsyncStorage.getItem('class');
  }

  public render() {
    return (
        !this.loading ? (
            <View style={styles.container}>
              <TabView
                  swipeEnabled={true}
                  renderTabBar={(props) => (
                      <TabBar
                          {...props}
                          indicatorStyle={{backgroundColor: '#FF3333'}}
                          activeColor={this.context.theme == 'light' ? 'white' : '#b41019'}
                          inactiveColor={'lightgray'}
                          style={{backgroundColor: this.context.theme == 'light' ? '#b41019' : '#322f3d'}}/>
                  )}
                  navigationState={{
                    index: this.index, routes: [{key: 'first', title: 'Heute'},
                      {key: 'second', title: 'Morgen'}]
                  }}
                  renderScene={SceneMap({
                    first: () => <PlanView plan={this.today} onRefresh={this.loadPlans.bind(this)}
                                           studentClass={this.studentClass}/>,
                    second: () => <PlanView plan={this.tomorrow} onRefresh={this.loadPlans.bind(this)}
                                            studentClass={this.studentClass}/>
                  })}
                  onIndexChange={(i) => this.index = i}
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