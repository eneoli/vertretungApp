import {Component} from "react";
import * as React from "react";
import {View, Text, AsyncStorage, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {MoodleProvider} from "../../providers/moodle";
import {NavigationStackScreenProps} from "react-navigation-stack";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {PlanView} from "../PlanView";

@observer
export class Plan extends Component<NavigationStackScreenProps> {
  @observable
  private moodleSession: string = '';
  @observable
  private today: any = {};
  private tomorrow: any = {};

  @observable
  private index: number = 0;

  constructor(props) {
    super(props);
    this.loadPlans();
  }

  public loadPlans() {
    AsyncStorage.getItem('moodleSession').then((m) => {
      this.moodleSession = m;
      MoodleProvider.getPlan('today', this.moodleSession).then((plan) => {
        this.today = plan;
        console.log("Set!");
        this.props.navigation.setParams({title: "Hi!"});
      });
      MoodleProvider.getPlan('tomorrow', this.moodleSession).then((plan) => {
        this.tomorrow = plan;
        console.log("Set!");
        this.props.navigation.setParams({title: "Hi!"});
      })
    });
  }

  public render() {
    return this.today || this.tomorrow ? (
        <View style={styles.container}>

          <TabView
              swipeEnabled={true}
              renderTabBar={(props) => <TabBar     {...props}
                                                   indicatorStyle={{backgroundColor: '#FF3333'}}
                                                   activeColor={'#FF3333'}
                                                   inactiveColor={'lightgray'}
                                                   style={{backgroundColor: 'white'}}/>}
              navigationState={{
                index: this.index, routes: [{key: 'first', title: 'Heute'},
                  {key: 'second', title: 'Morgen'}]
              }}
              renderScene={SceneMap({
                first: () => <PlanView plan={this.today} onRefresh={this.loadPlans.bind(this)}/>,
                second: () => <PlanView plan={this.tomorrow} onRefresh={this.loadPlans.bind(this)}/>
              })}
              onIndexChange={(i) => this.index = i}
          />
        </View>
    ) : <Text>Bitte warten...</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blub: {}
});