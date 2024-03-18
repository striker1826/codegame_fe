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
  cursor: pointer;
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
  const [isReady, setIsReady] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const params = new URLSearchParams(window.location.search);

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
      socket.emit("joinRoom", { roomname });
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
      console.log(data);
      alert(data);
      setIsLeaveRoom(true);
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
  };

  const handleLeaveRoom = () => {
    window.location.href = "/lobby";
  };

  const ReReady = isReady ? <Btn>준비완료</Btn> : <Btn onClick={handleToStart}>다시하기</Btn>;
  const Ready = isReady ? <Btn>준비완료</Btn> : <Btn onClick={handleToStart}>준비</Btn>;

  return (
    <>
      {isEnd ? (
        <Container>
          <BtnContainer>
            {isLeaveRoom ? <Btn onClick={onClickRoomReset}>방 초기화</Btn> : ReReady}

            <Btn onClick={onClickLeaveRoom}>방 나가기</Btn>
          </BtnContainer>
        </Container>
      ) : (
        <Container>
          {isTimer && <Timer limit={codeInfo.limit} setIsEnd={setIsEnd} />}

          <QnA question={codeInfo.question} onChangeCode={onChangeCode} code={codeInfo.code} />
          <BtnContainer>
            {isStart ? null : Ready}

            <Btn onClick={submit}>제출</Btn>
            <Btn onClick={handleLeaveRoom}>방 나가기</Btn>
          </BtnContainer>
          <Result codeError={codeError} />
        </Container>
      )}
    </>
  );
}
