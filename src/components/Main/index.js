import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from "semantic-ui-react";
import { render } from "react-dom";
import ReactFullscreeen from "react-easyfullscreen";
import mindImg from "../../images/mind.svg";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  CATEGORIES,
  NUM_OF_QUESTIONS,
  DIFFICULTY,
  QUESTIONS_TYPE,
  COUNTDOWN_TIME,
} from "../../constants";
import { shuffle } from "../../utils";

import Offline from "../Offline";
import mock from "../Quiz/mock.json";
const Main = ({ startQuiz }) => {
  const handle = useFullScreenHandle();
  const [category, setCategory] = useState("0");
  const [numOfQuestions, setNumOfQuestions] = useState(50);
  const [difficulty, setDifficulty] = useState("0");
  const [questionsType, setQuestionsType] = useState("0");
  const [countdownTime, setCountdownTime] = useState({
    hours: 3482,
    minutes: 59,
    seconds: 59,
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    category &&
    numOfQuestions &&
    difficulty &&
    questionsType &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=${questionsType}`;

    fetch(API)
      .then((respone) => respone.json())
      .then((data) =>
        setTimeout(() => {
          console.log(data);
          const { response_code, results } = mock;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (Ex.
                Asking for 50 Questions in a Category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>,{" "}
                <strong>Difficulty Level</strong>, or{" "}
                <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });

            return;
          }

          results.forEach((element) => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(
            results,
            countdownTime.hours + countdownTime.minutes + countdownTime.seconds
          );
        }, 1000)
      )
      .catch((error) =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };

  if (offline) return <Offline />;

  return (
    <Container>
      <Segment
        style={{
          marginTop: "100px",
        }}
      >
        <Item.Group divided>
          <Item>
            <Item.Image src={mindImg} />
            <Item.Content>
              <Item.Header>
                <h1> Quiz 2023 </h1>
              </Item.Header>
              {/*error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )*/}
              <Divider />
              <Item.Meta>
                {/* 
              <Dropdown
                fluid
                selection
                name="category"
                placeholder="Third Level"
                onChange={(e, { value }) => setCategory(value)}
                disabled={true}
              />
              <br />
              <Dropdown
                fluid
                selection
                name="numOfQ"
                placeholder=" No. of Questions"
                header=" No. of Questions"
                options={NUM_OF_QUESTIONS}
                value={50}
                onChange={(e, { value }) => setNumOfQuestions(value)}
                disabled={true}
              />
              <br />
              <Dropdown
                     fluid
                    selection
                     name="difficulty"
                     placeholder="Select Difficulty Level"
                     header="Select Difficulty Level"
                   options={DIFFICULTY}
                     value={difficulty}
                    onChange={(e, { value }) => setDifficulty(value)}
                     disabled={processing}
                   />
                  <Dropdown
                    fluid
                    selection
                    name="type"
                    placeholder="Select Questions Type"
                    header="Select Questions Type"
                    options={QUESTIONS_TYPE}
                    value={questionsType}
                    onChange={(e, { value }) => setQuestionsType(value)}
                    disabled={processing}
                  />
                 <br />

                <br />
                <Dropdown
                  search
                  selection
                  name="hours"
                  placeholder="1 Hour"
                  header="Select Hours"
                  // options={COUNTDOWN_TIME.hours}
                  value={1}
                  // onChange={handleTimeChange}
                  disabled={true}
                />
                <Dropdown
                  search
                  selection
                  name="minutes"
                  placeholder="0 Minutes"
                  header="Select Minutes"
                  options={COUNTDOWN_TIME.minutes}
                  onChange={handleTimeChange}
                  disabled={true}
                />
                <Dropdown
                  search
                  selection
                  name="seconds"
                  placeholder="0 Seconds"
                  header="Select Seconds"
                  options={COUNTDOWN_TIME.seconds}
                  onChange={handleTimeChange}
                  disabled={true}
                />
                */}
              </Item.Meta>
              <Divider />
              <Item.Extra>
                <Button
                  style={{
                    marginTop: "20px",
                    width: "200px",
                    height: "50px",
                  }}
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content={processing ? "Processing..." : "Start"}
                  onClick={() => {
                    fetchData();
                  }}
                  disabled={!allFieldsSelected || processing}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
