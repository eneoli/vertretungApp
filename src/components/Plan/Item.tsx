import {Component} from "react";
import * as React from "react";
import {View, StyleSheet, Text} from "react-native";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import Modal from 'react-native-modal';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBook, faCalendarDay, faComment, faSchool, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import {faExchangeAlt} from "@fortawesome/free-solid-svg-icons/faExchangeAlt";

moment.locale('de');

interface ItemProps {
  entry: any;
  day: Date;
  hide: boolean;
}

@observer
export class Item extends Component<ItemProps> {
  @observable
  private showDetail: boolean = false;
  @observable
  private hide: boolean;

  @action
  private toggleDetail() {
    this.showDetail = !this.showDetail;
  }

  constructor(props: ItemProps) {
    super(props);
    this.hide = this.props.hide;
  }

  private getRootStyles() {
    return StyleSheet.create({  itemWrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-around',
        alignSelf: 'center',
        flexWrap: "wrap",
        backgroundColor: '#FF4136',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        width: '80%',
        minHeight: 30,
        margin: 15,
        textAlign: 'center',
        opacity: this.hide ? 0.7 : 1,
      },});
  }

  public render(): React.ReactNode {
    return (
        <View>
          <View style={this.getRootStyles().itemWrapper} onTouchEnd={this.toggleDetail.bind(this)}>
            <Text style={styles.caption}>{this.props.entry.item.hour}</Text>
            <Text style={styles.text}>{this.props.entry.item.class}</Text>
            <Text style={styles.text}>{this.props.entry.item.subject}</Text>
            {this.props.entry.item.comment ?
                <View style={styles.textAddition}><Text
                    style={styles.textAddition}>{'\n'}Bemerkung: {this.props.entry.item.comment}</Text></View> :
                <Text></Text>}
          </View>
          <Modal onBackButtonPress={this.toggleDetail.bind(this)} onBackdropPress={this.toggleDetail.bind(this)}
                 isVisible={this.showDetail}>
            <View style={{height: 'auto', width: 'auto', backgroundColor: 'white', borderRadius: 5, margin: 20}}>
              <View style={{flexDirection: 'row', margin: 10}}>
                <FontAwesomeIcon icon={faCalendarDay} size={30}/>
                <Text
                    style={styles.textModal}>{this.props.entry.item.hour} Stunde, {moment(this.props.day).format('dd DD.MM')}</Text>
              </View>
              {this.props.entry.item.class ? <View style={{flexDirection: 'row', margin: 10}}>
                <FontAwesomeIcon icon={faUserFriends} size={30}/>
                <Text style={styles.textModal}>{this.props.entry.item.class}</Text>
              </View> : null}
              <View style={{flexDirection: 'row', margin: 10}}>
                <FontAwesomeIcon icon={faBook} size={30}/>
                <Text style={styles.textModal}>{this.props.entry.item.subject}</Text>
              </View>
              {this.props.entry.item.room ? <View style={{flexDirection: 'row', margin: 10}}>
                <FontAwesomeIcon icon={faSchool} size={30}/>
                <Text style={styles.textModal}>{this.props.entry.item.room}</Text>
              </View> : null}
              {this.props.entry.item.comment ? <View style={{flexDirection: 'row', margin: 10}}>
                <FontAwesomeIcon icon={faComment} size={30}/>
                <Text style={styles.textModal}>{this.props.entry.item.comment}</Text>
              </View> : null}
              {
                this.props.entry.item.replacement ?
                    <View style={{flexDirection: 'row', margin: 10}}>
                      <Text style={styles.textModal}>{this.props.entry.item.teacher}</Text>
                      <FontAwesomeIcon icon={faExchangeAlt} size={30}/>
                      <Text style={styles.textModal}>{this.props.entry.item.replacement}</Text>
                    </View> : null
              }
            </View>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    padding: 0,
    margin: 20,
    color: 'white',
  },
  textAddition: {
    color: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
    flexBasis: '100%',
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    lineHeight: 55,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    marginLeft: 10,
  },
  textModal: {
    padding: 5,
    margin: 10,
    fontSize: 18,
    lineHeight: 18,
    color: 'black',
  }
});