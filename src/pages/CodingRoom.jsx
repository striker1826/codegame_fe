import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QnA } from "../components/QnA";
import { Result } from "../components/Result";
import axios from "axios";
import { GithubLogin } from "../components/auth/GithubLogin";

const BASE_URL = "https://minseob-codegame.koyeb.app";
// const BASE_URL = "http://localhost:8000";

const Container = styled.div`
  background-color: #b4c3ff;
  padding: 30px 50px;
`;

export function CodingRoom({ socket }) {
  const [codeInfo, setCodeInfo] = useState({ code: "", questionId: 0, question: "" });
  const [testResult, setTestResult] = useState([]);
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    const getQuestion = async () => {
      const response = await axios.get(`${BASE_URL}/api/question`);
      const data = response.data;

      setCodeInfo((prev) => {
        return {
          ...prev,
          code: data.format,
          questionId: data.questionId,
          question: data.question,
        };
      });
    };

    getQuestion();
  }, []);

  // socket useEffect

  // socket on functions ===================================
  useEffect(() => {
    socket.on("joinRoom", (data) => {});
  }, [socket]);

  // =======================================================

  const runCode = async (code) => {
    try {
      const output = await eval(code + `solution(1)`);
      return output;
    } catch (err) {
      return err;
    }
  };

  const submit = async () => {
    const codeResult = await runCode(codeInfo.code);
    if (codeResult instanceof Error) {
      setCodeError(String(codeResult));
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/question/grading/2`, { code: codeInfo.code });
      const testResult = response.data;
      console.log(testResult);
      if (testResult.some((result) => result === false)) {
        alert("테스트를 통과하지 못했습니다.");
        return;
      } else {
        await socket.emit("playerWin");
        alert("테스트를 통과했습니다.");
        return;
      }
    } catch (err) {
      // TODO: status code handling....
    }

    setTestResult((prev) => {
      return [...testResult];
    });
  };

  const onChangeCode = (value) => {
    setCodeInfo((prev) => {
      return {
        ...prev,
        code: value,
      };
    });
  };

  return (
    <Container>
      <QnA question={codeInfo.question} onChangeCode={onChangeCode} code={codeInfo.code} />
      <button onClick={submit}>제출</button>
      <Result codeError={codeError} />
    </Container>
  );
}
