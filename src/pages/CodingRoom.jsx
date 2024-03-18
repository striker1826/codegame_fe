import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QnA } from "../components/QnA";
import { Result } from "../components/Result";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Timer } from "../components/Timer";

const BASE_URL = "https://minseob-codegame.koyeb.app";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Container = styled.div`
  background-color: #b4c3ff;
  padding: 30px 50px;
  width: 100%;
  height: 100vh;
`;

const Btn = styled.button`
  color: #fff;
  background-color: #000;
  text-align: center;
  width: 100px;
  padding: 10px;
  border: none;
`;

const BtnContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

export function CodingRoom() {
  const [codeInfo, setCodeInfo] = useState({ code: "", questionId: 0, question: "", limit: "" });
  const [testResult, setTestResult] = useState([]);
  const [codeError, setCodeError] = useState("");
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const roomname = params.get("roomname");
    const key = params.get("key");
    if (key === "create") {
      socket.emit("createRoom", { roomname });
      return;
    }

    if (key === "join") {
      socket.emit("joinRoom", { roomname });
    }
  }, []);

  const handleToStart = async () => {
    setIsStart(true);
    const res = await axios.get(`${BASE_URL}/api/question`);
    const data = res.data;
    socket.emit("syncQuestion", { questionId: data.questionId });

    setCodeInfo((prev) => {
      return {
        ...prev,
        code: data.format,
        questionId: data.questionId,
        question: data.question,
        limit: Number(data.time) * 60,
      };
    });
    setIsTimer(true);
  };

  const onClilckToRestart = async () => {
    setIsEnd(false);
    setIsStart(true);
    const res = await axios.get(`${BASE_URL}/api/question`);
    const data = res.data;
    socket.emit("syncQuestion", { questionId: data.questionId });
    setCodeInfo((prev) => {
      return {
        ...prev,
        code: data.format,
        questionId: data.questionId,
        question: data.question,
        limit: Number(data.time) * 60,
      };
    });
    setIsTimer(true);
  };

  const onClickLeaveRoom = () => {
    window.location.href = "/lobby";
  };

  // socket on functions ===================================
  useEffect(() => {
    socket.on("syncQuestion", (data) => {
      setIsEnd(false);
      setIsStart(true);
      setCodeInfo((prev) => {
        return {
          ...prev,
          code: data.format,
          questionId: data.questionId,
          question: data.question,
          limit: Number(data.time) * 60,
        };
      });
    });
  }, [socket]);

  useEffect(() => {
    socket.on("playerLose", (data) => {
      alert("you lose");
      setIsEnd(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("joinRoom", (data) => {
      alert(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("leaveRoom", (data) => {
      alert(data);
    });
  });
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
      if (testResult.some((result) => result === false)) {
        alert("테스트를 통과하지 못했습니다.");
        return;
      } else {
        setIsTimer(false);
        await socket.emit("playerWin");
        alert("테스트를 통과했습니다.");
        setIsEnd(true);
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
    <>
      {isEnd ? (
        <Container>
          <BtnContainer>
            <Btn onClick={onClilckToRestart}>다시하기</Btn>
            <Btn onClick={onClickLeaveRoom}>방 나가기</Btn>
          </BtnContainer>
        </Container>
      ) : (
        <Container>
          {isTimer && <Timer limit={codeInfo.limit} setIsEnd={setIsEnd} />}
          <QnA question={codeInfo.question} onChangeCode={onChangeCode} code={codeInfo.code} />
          <BtnContainer>
            {isStart || <Btn onClick={handleToStart}>시작</Btn>}
            <Btn onClick={submit}>제출</Btn>
          </BtnContainer>
          <Result codeError={codeError} />
        </Container>
      )}
    </>
  );
}
