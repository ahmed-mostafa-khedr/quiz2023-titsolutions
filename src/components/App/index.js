import React, { useEffect, useState } from "react";

import Layout from "../Layout";
import Loader from "../Loader";
import Main from "../Main";
import Quiz from "../Quiz";
import Result from "../Result";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { shuffle } from "../../utils";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const handle = useFullScreenHandle();

  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (e) => {
      // prevent the right-click menu from appearing
      e.preventDefault();
    };

    // attach the event listener to
    // the document object
    document.addEventListener("contextmenu", handleContextMenu);

    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const startQuiz = (data, countdownTime) => {
    setLoading(true);
    handle.enter();
    setCountdownTime(countdownTime);

    setTimeout(() => {
      setData(data);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  const endQuiz = (resultData) => {
    setLoading(true);

    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(resultData);
      setLoading(false);
    }, 2000);
  };

  const replayQuiz = () => {
    setLoading(true);

    const shuffledData = shuffle(data);
    shuffledData.forEach((element) => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <FullScreen handle={handle}>
      <Layout>
        {loading && <Loader />}
        {!loading && !isQuizStarted && !isQuizCompleted && (
          <Main startQuiz={startQuiz} />
        )}
        {!loading && isQuizStarted && (
          <Quiz data={data} countdownTime={countdownTime} endQuiz={endQuiz} />
        )}
        {!loading && isQuizCompleted && (
          <Result
            {...resultData}
            replayQuiz={replayQuiz}
            resetQuiz={resetQuiz}
          />
        )}
      </Layout>
    </FullScreen>
  );
};

export default App;
