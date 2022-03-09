import React from "react";
import { Panel, PanelHeader, Group } from "@vkontakte/vkui";
import { db, doc, deleteDoc } from "../../firebase";

import ListCurrentVisiters from "./list-current-visiters";
import FormAddVisit from "./form-add-visit";

class Visiters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visits: [],
      visiters: [],
      activePanel: "currentList",
      addType: "new",
      oldVisiterId: null,
      newVisiterName: ""
    };

    db.collection("visiters").onSnapshot(querySnapshot => {
      this.setState({ visiters: querySnapshot.docs });
      console.log(querySnapshot.docs);
      const toRemove = querySnapshot.docs.filter(item => {
        return !item.data().name
      });
      console.log('toRemove: ', toRemove);

      // db.collection("cities").doc("DC").delete().then(() => {
      //   console.log("Document successfully deleted!");
      // }).catch((error) => {
      //   console.error("Error removing document: ", error);
      // });
    });

    var dateFrom = new Date();
    date.setDate(date.getDate() - 1);

    db.collection("visits").where('end', '==', null).onSnapshot(querySnapshot => {
      this.setState({ visits: querySnapshot.docs });
    });
  }

  handleVisiterNameChange = e => {
    this.setState({ newVisiterName: e.target.value });
  };
  addNewVisiterWithVisit = () => {
    db.collection("visiters")
      .add({
        name: this.state.newVisiterName
      })
      .then(function (docRef) {
        db.collection("visits").add({
          visiter_id: docRef.id,
          start: new Date(),
          end: null
        });
        console.log("Document written with ID: ", docRef.id);
      });
    this.setState({ newVisiterName: "" });
  };

  onSubmit = e => {
    console.log(e);
  };

  selectedOldVisiter = () => {
    if (this.state.oldVisiterId) {
      return this.state.visiters.find(
        visiter => visiter.id === this.state.oldVisiterId
      );
    }
  };

  goToVisitersSelector = () => {
    this.setState({ activePanel: "visitersSelector" });
  };

  AdminUI = () => {
    return (
      <Group title="Список людей">
        <FormAddVisit
          onSubmit={this.onSubmit}
          selectedOldVisiter={this.selectedOldVisiter()}
          goToVisitersSelector={this.goToVisitersSelector}
        />
        <ListCurrentVisiters
          visits={this.state.visits}
          visiters={this.state.visiters}
        />
      </Group>
    );
    // this.setState({ activePanel: e.currentTarget.dataset.to })
  };

  render() {
    return (
      <View activePanel="countries" id="visiters">
        <Panel id={this.props.id}>
          <PanelHeader>Список текущих посетителей</PanelHeader>
          {this.AdminUI()}
        </Panel>
      </View>
    );
  }
}

export default Visiters;
