import React from "react";
import {
  FormLayout,
  FormLayoutGroup,
  Div,
  Button,
  Input,
  Checkbox,
  Cell,
  CellButton,
  List,
  Textarea
} from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon24LogoLivejournal from '@vkontakte/icons/dist/24/logo_livejournal';
import CF from "../../common-functions";

export default class Visiters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addNew: false,
      visiterName: "",
      visiterDescription: ""
    };
  }

  handleVisiterNameChange = e => {
    this.setState({ visiterName: e.target.value });
  };

  handleVisiterDescriptionChange = e => {
    this.setState({ visiterDescription: e.target.value });
  };

  renderVisiterAdd = () => {
    if (this.state.addNew) {
      return (
        <FormLayoutGroup>
          <Textarea
            value={this.state.visiterDescription}
            onChange={this.handleVisiterDescriptionChange}
            top="Короткое описание"
            placeholder="Подпись, чтобы точно определять человека"
          />
          <Button size="xl">Добавить посетитетеля</Button>
        </FormLayoutGroup>
      );
    } else {
      return this.renderVisiterSearch();
    }
  };

  submitUser = e => {
    e.preventDefault();
    this.props.onSubmit({
      name: this.state.visiterName,
      description: this.state.visiterDescription
    });
    this.setState({
      visiterName: '',
      visiterDescription: ''
    })
  };

  handleChangeAddNew = () => {
    this.setState({ addNew: !this.state.addNew });
  };

  renderVisiterSearch = () => {
    const search = this.state.visiterName;
    const foundVisiters = this.props.visiters.filter(visiter => {
      return !search || CF.checkStringInString(visiter.name, search);
    });

    if (!foundVisiters.length) {
      console.log(this.props.visiters, search);
      return <Div>Посетителей не найдено</Div>;
    }
    const currentVisitersIdsHash = this.props.visits
      .filter(visit => !visit.data().end)
      .reduce((total, visit) => {
        total[visit.data().visiter_id] = visit.id;
        return total;
      }, {});

    const visiterList = foundVisiters
      .map(visiter => {
        return {
          name: visiter.name,
          description: visiter.description,
          id: visiter.id,
          isVisiting: currentVisitersIdsHash[visiter.id]
        };
      })
      .sort((v1, v2) => {
        return !!v1.isVisiting - !!v2.isVisiting;
      })
      .slice(0, 50)
      .map(visiterItem => {
        if (!visiterItem.isVisiting) {
          return (
            <Cell
              key={visiterItem.id}
              style={visiterItem.isVisiting && { color: "#909090" }}
              before={<Icon24LogoLivejournal onClick={() => this.props.editVisiter(visiterItem.id)} />}
              asideContent={<Icon24Add onClick={e => this.props.selectOldVisiter(visiterItem)} />}
              description={visiterItem.description}
            >
              {visiterItem.name}
            </Cell>
          );
        } else {
          return (
            <Cell description={visiterItem.description} key={visiterItem.id}>
              {visiterItem.name}
            </Cell>
          );
        }
      });

    return <List>{visiterList}</List>;
  };

  render() {
    return (
      <FormLayout onSubmit={this.submitUser}>
        <FormLayoutGroup>
          <Input
            value={this.state.visiterName}
            onChange={this.handleVisiterNameChange}
            placeholder="Никнейм"
          />
          <Checkbox
            value={this.state.addNew}
            onChange={this.handleChangeAddNew}
          >
            Добавить нового пользователя
          </Checkbox>
        </FormLayoutGroup>
        {this.renderVisiterAdd()}
      </FormLayout>
    );
  }
}
