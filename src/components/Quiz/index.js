import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";

import Stack from "@mui/material/Stack";
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
  Modal,
} from "semantic-ui-react";
import he from "he";

import Countdown from "../Countdown";
import { getLetter } from "../../utils";

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);

  const handleItemClick = (e, { name }) => {
    setUserSlectedAns(name);
    setShow(false);
    setAgreed(true);
  };
  useEffect(() => setShow(false), [agreed]);

  const handleNext = () => {
    let point = 0;

    if (!userSlectedAns) {
      setShow(true);
      setAgreed(false);
    } else if (
      userSlectedAns === he.decode(data[questionIndex].correct_answer)
    ) {
      point = 1;
    }

    const qna = questionsAndAnswers;
    qna.push({
      question: he.decode(data[questionIndex].question),
      user_answer: userSlectedAns,
      correct_answer: he.decode(data[questionIndex].correct_answer),
      point,
    });

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }
    if (agreed) {
      setCorrectAnswers(correctAnswers + point);
      setQuestionIndex(questionIndex + 1);
      setUserSlectedAns(null);
      setQuestionsAndAnswers(qna);
    }
  };

  const timeOver = (timeTaken) => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Item.Header>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra>
                  <Header as="h1" block floated="left">
                    <Icon name="info circle" />
                    <Header.Content>
                      {`Question No.${questionIndex + 1} of ${data.length}`}
                    </Header.Content>
                  </Header>
                  <Countdown
                    countdownTime={countdownTime}
                    timeOver={timeOver}
                    setTimeTaken={setTimeTaken}
                  />
                </Item.Extra>
                <br />
                <Item.Meta>
                  <Message size="huge" floating>
                    <b>{`Q. ${he.decode(data[questionIndex].question)}`}</b>
                  </Message>
                  <br />
                  <Item.Description>
                    <h3>Please choose one of the following answers:</h3>
                  </Item.Description>
                  <Divider />
                  <Menu vertical fluid size="massive">
                    {data[questionIndex].options.map((option, i) => {
                      const letter = getLetter(i);
                      const decodedOption = he.decode(option);

                      return (
                        <Menu.Item
                          key={decodedOption}
                          name={decodedOption}
                          active={userSlectedAns === decodedOption}
                          onClick={handleItemClick}
                        >
                          <b style={{ marginRight: "8px" }}>{letter}</b>
                          {decodedOption}
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                </Item.Meta>
                <Divider />
                {show ? (
                  <Stack
                    sx={{
                      width: "100%",
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      margin: "auto",
                      display: "flex",
                      alignItems: "center",
                      height: "79vh",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      transform: "translateY(-50%)",
                    }}
                    spacing={2}
                  >
                    <Alert
                      sx={{
                        display: "flex",
                        width: "100%",
                        margin: "auto",
                      }}
                      severity="error"
                      action={
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setAgreed(true);
                            setShow(false);
                          }}
                        >
                          Agree
                        </Button>
                      }
                    >
                      you didn't answer the question
                    </Alert>
                  </Stack>
                ) : (
                  ""
                )}
                <Item.Extra>
                  <Button
                    primary
                    content="Next"
                    onClick={() => {
                      handleNext();
                    }}
                    floated="right"
                    size="big"
                    icon="right chevron"
                    labelPosition="right"
                    // disabled={!userSlectedAns}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;
