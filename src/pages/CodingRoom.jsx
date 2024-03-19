import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GameEndPage } from "../components/GameEndPage";
import { GamePage } from "../components/GamePage";
import { GradeResult } from "../components/GradeResult";

const BASE_URL = "https://minseob-codegame.koyeb.app";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Btn = styled.button`
  color: #fff;
  background-color: #000;
  text-align: center;
  width: 100px;
  padding: 10px;
  border: none;
  cursor: pointer;
`;

export function CodingRoom() {
  const [codeInfo, setCodeInfo] = useState({ code: "", questionId: 0, question: "", limit: "" });
  const [testCases, setTestCases] = useState([]);
  const [codeError, setCodeError] = useState("");
  const [isStart, setIsStart] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const [gradingResult, setGradingResult] = useState([]);
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const roomname = params.get("roomname");
    const key = params.get("key");
    if (key === "create") {
      socket.emit("createRoom", { roomname });
      alert(
        "방이 생성되었습니다. 상대방이 들어올때까지 기다리셔도 되고 솔로 플레이 모드를 즐기시려면 준비 버튼을 눌러주세요."
      );
      return;
    }

    if (key === "join") {
      try {
        socket.emit("joinRoom", { roomname });
      } catch (err) {}
    }
  }, []);

  const handleToStart = async () => {
    socket.emit("ready");
    setIsReady(true);
    // alert("상대방의 준비가 완료될 때 까지 기다려주세요.");
  };

  const onClickLeaveRoom = () => {
    window.location.href = "/lobby";
  };

  // socket on functions ===================================
  useEffect(() => {
    socket.on("start", (data) => {
      setIsEnd(false);
      setIsStart(true);
      setIsTimer(true);
      setIsReady(false);

      setTestCases(() => [...data.testCases]);

      setCodeInfo((prev) => {
        return {
          ...prev,
          code: data.question.format,
          questionId: data.question.questionId,
          question: data.question.question,
          limit: Number(data.question.time) * 60,
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
      setIsLeaveRoom(true);
      alert(data);
    });
  }, [socket]);
  // =======================================================

  const runCode = async (code) => {
    try {
      const output = await eval(code + `solution(${testCases[0].input})`);
      console.log(testCases);
      console.log(typeof output);
      console.log(output);
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
      setIsGrading(true);
      const response = await axios.post(`${BASE_URL}/api/grading/run/${codeInfo.questionId}`, { code: codeInfo.code });
      const testResult = response.data;

      if (testResult.some((result) => result.result === "실패")) {
        setGradingResult(() => [...testResult]);
        alert("테스트를 통과하지 못했습니다.");
        return;
      } else {
        setIsTimer(false);
        setGradingResult(() => [...testResult]);
        await socket.emit("playerWin");
        alert("테스트를 통과했습니다.");
        setIsEnd(true);
        return;
      }
    } catch (err) {
      // TODO: status code handling....
    } finally {
      setIsGrading(false);
    }
  };

  const onChangeCode = (value) => {
    setCodeInfo((prev) => {
      return {
        ...prev,
        code: value,
      };
    });
  };

  const onClickRoomReset = () => {
    setCodeInfo((prev) => {
      return {
        code: "",
        question: "",
        questionId: 0,
        limit: "",
      };
    });

    setIsStart(false);
    setIsReady(false);
    setIsTimer(false);
    setIsEnd(false);
    setIsLeaveRoom(false);
  };

  const handleLeaveRoom = () => {
    navigate("/lobby");
    window.location.reload();
  };

  const ReReadyComponent = isReady ? <Btn>준비완료</Btn> : <Btn onClick={handleToStart}>다시하기</Btn>;
  const ReadyComponent = isReady ? <Btn>준비완료</Btn> : <Btn onClick={handleToStart}>준비</Btn>;
  const SubmitComponent = isStart ? <Btn onClick={submit}>제출</Btn> : ReadyComponent;

  return (
    <>
      {isEnd ? (
        <GameEndPage
          isLeaveRoom={isLeaveRoom}
          onClickRoomReset={onClickRoomReset}
          onClickLeaveRoom={onClickLeaveRoom}
          ReReadyComponent={ReReadyComponent}
        />
      ) : (
        <GamePage
          isTimer={isTimer}
          codeInfo={codeInfo}
          setIsEnd={setIsEnd}
          onChangeCode={onChangeCode}
          isGrading={isGrading}
          SubmitComponent={SubmitComponent}
          GradeResult={gradingResult}
          handleLeaveRoom={handleLeaveRoom}
          codeError={codeError}
          testCases={testCases}
        />
      )}
    </>
  );
}
