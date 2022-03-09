import React from "react";
import PropTypes from "prop-types";
import {
  Panel,
  ListItem,
  Button,
  Group,
  Div,
  Avatar,
  PanelHeader,
  FormLayout,
  FormLayoutGroup,
  Input
} from "@vkontakte/vkui";

let search = "";
let data = null;
function setSearch(event) {
  search = event.target.value;
}

function launchSearch() {
  fetch("https://api.tesera.ru/search/games?query=" + search)
    .then(function(response) {
      return response.json();
    })
    .then(res => {
      console.log(res);

      fetch("https://api.tesera.ru/games/" + res[0].alias)
        .then(function(response) {
          return response.json();
        })
        .then(res => {
          data = res;
        });
    });
}

const Home = ({ id, go, fetchedUser }) => (
  <Panel id={id}>
    <PanelHeader>Арена Эмоций</PanelHeader>
    {fetchedUser && (
      <Group title="User Data Fetched with VK Connect">
        <ListItem
          before={
            fetchedUser.photo_200 ? (
              <Avatar src={fetchedUser.photo_200} />
            ) : null
          }
          description={
            fetchedUser.city && fetchedUser.city.title
              ? fetchedUser.city.title
              : ""
          }
        >
          {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
        </ListItem>
      </Group>
    )}
    <FormLayout>
      <FormLayoutGroup top="Название игры на тесере">
        <Input type="text" onInput={setSearch} />
      </FormLayoutGroup>
      <Button onClick={launchSearch}>Поиск</Button>
    </FormLayout>
    {data && <Div>{data}</Div>}

    <Group title="Navigation Example">
      <Div>
        <Button size="xl" level="2" onClick={go} data-to="persik">
          Show me the Persik, please
        </Button>
      </Div>
    </Group>
  </Panel>
);

Home.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string
    })
  })
};

export default Home;
