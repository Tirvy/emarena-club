import React from "react";
import { Cell, Button } from "@vkontakte/vkui";
import Icon24LogoLivejournal from "@vkontakte/icons/dist/24/logo_livejournal";

export default function(props) {
  return (
    <Cell
      key={visit.id}
      before={
        props.editVisiter && (
          <Icon24LogoLivejournal
            onClick={() => props.editVisiter(visiter_id)}
          />
        )
      }
      asideContent={props.asideContent}
      description={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              overflow: "auto",
              textOverflow: "ellipsis",
              paddingRight: "10px"
            }}
          >
            {visiter_data.description || "-"}
          </div>
          <div>{formatted_start}</div>
        </div>
      }
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{visiter_data.name}</div>
        <div>{diff}</div>
      </div>
    </Cell>
  );
}
