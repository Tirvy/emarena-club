import React from "react";
import {
  FormLayout,
  FormLayoutGroup,
  Div,
  Radio,
  Button,
  Input,
  SelectMimicry
} from "@vkontakte/vkui";

export default class Visiters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addType: "new"
    };
  }

  handleRadioChange = e => {
    console.log(e)
    this.setState({ addType: e.target.value });
  };

  oldVisiterName = () => {
    if (this.props.selectedOldVisiter) {
      return this.props.selectedOldVisiter.data().name;
    }
    return 'Не выбран'
  }

  renderAddUser = () => {
    if (this.state.addType === "new") {
      return (
        <Input
          value={this.state.newVisiterName}
          onChange={this.handleVisiterNameChange}
          placeholder="Имя / никнейм"
        />
      );
    } else {
      return (
        <SelectMimicry
          top="Выберите из списка"
          placeholder="Не выбран"
          onClick={() => this.props.goToVisitersSelector()}
        >
          {this.oldVisiterName()}
        </SelectMimicry>
      );
    }
  };

  render() {
    return (
      <FormLayout onSubmit={this.props.onSubmit}>
        <FormLayoutGroup top="Добавить человека">
          <div>
            <Radio
              name="radio"
              value="new"
              onChange={this.handleRadioChange}
              checked={this.state.addType === "new"}
            >
              Добавить нового посетителя
            </Radio>
            <Radio
              name="radio"
              value="old"
              onChange={this.handleRadioChange}
              checked={this.state.addType === "old"}
            >
              Добавить из списка
            </Radio>
          </div>
          {this.renderAddUser()}
          <Div>
            <Button>Добавить посетителя</Button>
          </Div>
        </FormLayoutGroup>
      </FormLayout>
    );
  }
}
