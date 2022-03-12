import React from "react";
import {
  Panel,
  PanelHeader,
  Group,
  View,
  HeaderButton,
  Snackbar,
  Avatar,
  platform,
  IOS
} from "@vkontakte/vkui";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon16Done from "@vkontakte/icons/dist/16/done";
import { db } from "../../firebase";
import PanelVisiterEditing from "../../panels/visiter-editing.js";

import FormAddVisit from "./form-add-visit";

const osname = platform();

class Visiters extends React.Component {
  constructor(props) {
    super(props);

    let unsubscribeCallbacks = [];

    unsubscribeCallbacks.push(
      db.collection("visits").where('end', '==', null).onSnapshot(querySnapshot => {
        this.setState({ visits: querySnapshot.docs });
      })
    );

    this.state = {
      visits: [],
      activePanel: "currentList",
      addType: "new",
      oldVisiterId: null,
      newVisiterName: "",
      unsubscribeCallbacks,
      currentEditing: null,
      snackbar: null,
      popout: null,
    };
  }

  componentWillUnmount = () => {
    this.state.unsubscribeCallbacks.forEach(func => func());
  };

  handleVisiterNameChange = e => {
    this.setState({ newVisiterName: e.target.value });
  };

  addVisit = visiter_id => {
    db.collection("visits")
      .add({
        visiter_id: visiter_id,
        start: new Date(),
        end: null
      })
      .then(() => {
        if (this.state.snackbar) return;
        const visiter = this.props.visiters.find(
          visiter => visiter.id === visiter_id
        );
        const visiter_name = visiter && visiter.name;
        this.setState({
          snackbar: (
            <Snackbar
              layout="vertical"
              onClose={() => this.setState({ snackbar: null })}
              before={
                <Avatar size={24}>
                  <Icon16Done fill="#fff" width={14} height={14} />
                </Avatar>
              }
            >
              {visiter_name} записан!
            </Snackbar>
          )
        });
      });
  };

  onSubmit = data => {
    db.collection("visiters")
      .add({
        name: data.name,
        description: data.description
      })
      .then(docRef => {
        const visit_id = docRef.id;
        db.collection("customers")
          .add({
            date: new Date(),
            list: [...this.props.visiters, {
              id: visit_id,
              name: data.name,
              description: data.description
            }]
          }).then(docRed => {
            this.addVisit(visit_id);
          })
      });
    return false;
  };

  selectedOldVisiter = () => {
    if (this.state.oldVisiterId) {
      return this.props.visiters.find(
        visiter => visiter.id === this.state.oldVisiterId
      );
    }
  };

  selectOldVisiter = visiterItem => {
    this.addVisit(visiterItem.id);
  };

  editVisiter = visiter_id => {
    const visiter = this.props.visiters.find(
      visiter => visiter.id === visiter_id
    );
    this.setState({
      currentEditing: {
        id: visiter.id,
        name: visiter.name,
        description: visiter.description
      }
    });
  };

  setPopout = (popout) => {
    this.setState({
      popout: popout
    });
  };

  getCurrentPanel = () => {
    if (this.state.currentEditing) {
      return "editing";
    }
    return "visiters";
  };

  render() {
    return (
      <View activePanel={this.getCurrentPanel()}
        popout={this.state.popout}>
        <Panel id="visiters">
          <PanelHeader
            left={
              global.DESIGN === "vika" && (
                <HeaderButton onClick={this.props.goToClub}>
                  {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                </HeaderButton>
              )
            }
          >
            Список посетителей
          </PanelHeader>
          <Group>
            <FormAddVisit
              onSubmit={this.onSubmit}
              selectedOldVisiter={this.selectedOldVisiter()}
              selectOldVisiter={this.selectOldVisiter}
              visits={this.state.visits}
              visiters={this.props.visiters}
              editVisiter={this.editVisiter}
            />
          </Group>
          {this.state.snackbar}
        </Panel>
        <PanelVisiterEditing
          id="editing"
          visiter={this.state.currentEditing}
          visiters={this.props.visiters}
          goBack={() => this.setState({ currentEditing: null })}
          setPopout={this.setPopout}
        ></PanelVisiterEditing>
      </View>
    );
  }
}

export default Visiters;
