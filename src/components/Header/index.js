import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";

const Header = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  const [appAccepted, setAppAccepted] = useState(false);

  let isAppInstalled = false;

  // if (window.matchMedia("(display-mode: standalone)").matches || appAccepted) {
  //   isAppInstalled = true;
  // }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    setPromptEvent(e);
  });

  // const installApp = () => {
  //   promptEvent.prompt();
  //   promptEvent.userChoice.then((result) => {
  //     if (result.outcome === "accepted") {
  //       setAppAccepted(true);
  //       console.log("User accepted the A2HS prompt");
  //     } else {
  //       console.log("User dismissed the A2HS prompt");
  //     }
  //   });
  // };

  return (
    <Menu stackable inverted size="massive">
      <Menu.Item header>
        <h1 style={{ color: "#fff" }}>2023 Exam</h1>
        <h6 style={{ color: "#ccc", marginLeft: "10px" }}>T.I.T.Solutions</h6>
      </Menu.Item>
      {/*promptEvent && !isAppInstalled && (
        <Menu.Item position="right">
          <Button
            color="teal"
            icon="cloud download"
            labelPosition="left"
            content="Install App"
            onClick={installApp}
          />
        </Menu.Item>
      )*/}
    </Menu>
  );
};

export default Header;
