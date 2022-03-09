import React from "react";
import {
  List,
  Cell,
} from "@vkontakte/vkui";

export default function (props) {
  return (
    <List>
      {props.visits
        .filter(visit => !visit.end)
        .map(visit => {
          const visiter = props.visiters.find(visiter => {
            return visiter.id === visit.visiter_id;
          });
          const visiter_data = visiter
            ? visiter
            : { name: "undefined" };
          return <Cell key={visit.id}>{visiter_data.name}</Cell>;
        })}
    </List>
  );
}
