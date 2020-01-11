import {Component, ReactNode} from "react";
import {FlatList, RefreshControl, ScrollView, Text} from "react-native";
import {Item} from "../Plan/Item";
import * as React from 'react';
import {InfoHeader} from "../InfoHeader";
import {observer} from "mobx-react";
import {observable} from "mobx";

interface IPlanViewProps {
  plan: any;
  onRefresh: () => void;
}

@observer
export class PlanView extends Component<IPlanViewProps> {
  @observable
  private refreshing: boolean = false;

  public render(): ReactNode {
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={this.refreshing} onRefresh={(() => {
              this.refreshing = true;
              this.props.onRefresh();
              this.refreshing = false;
            }).bind(this)}/>}>
          <InfoHeader day={this.props.plan.date} missingTeachers={this.props.plan.missingTeachers}
                      usedTeachers={this.props.plan.usedTeachers}/>
          <FlatList scrollEnabled={false} data={this.props.plan.lessons} renderItem={(e) => {
            return <Item entry={e} day={(this.props.plan.date)}/>;
          }}/>
          <Text>Alle Angaben ohne Gewähr!</Text>
        </ScrollView>
    );
  }
}