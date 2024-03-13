import { styled } from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { QnA } from "../components/QnA";
import { Result } from "../components/Result";

const socket = io.connect("https://minseob-codegame.koyeb.app/");
// const socket = io.connect("http://localhost:8000/");

const Container = styled.div`
  background-color: #b4c3ff;
  padding: 30px 50px;
`;

export function CodingRoom() {
  const [code, setCode] = useState(`function solution(n) {
  
}`);
  const [testResult, setTestResult] = useState([]);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    const getQuestion = async () => {
      const response = await axios.get("https://minseob-codegame.koyeb.app/api/question");
      // const response = await axios.get("http://localhost:8000/api/question");
      const question = response.data.question;
      setQuestion(question);
    };

    getQuestion();
  }, []);

  // socket useEffect
  const createRoom = () => {
    socket.emit("createRoom", { roomname: "firstRoom" });
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomname: "firstRoom", message: "hello" });
  };

  const sendMessage = (message) => {
    setChat((prev) => [...prev, message]);
    socket.emit("sendMessage", { roomname: "firstRoom", message });
  };

  // socket on functions ===================================
  useEffect(() => {
    socket.on("joinRoom", (data) => {
      setChat((prev) => [...prev, data.message]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data.message]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("playerLose", (data) => {
      alert("you lose");
    });
  }, [socket]);
  // =======================================================

  const runCode = async (code) => {
    try {
      console.log(code);
      const output = await eval(code + `solution(1)`);
      console.log(output);
      return output;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const submit = async () => {
    const codeResult = await runCode(code);
    if (codeResult instanceof Error) {
      setCodeError(String(codeResult));
      return;
    }

    try {
      const response = await axios.post("https://minseob-codegame.koyeb.app/api/question/grading/2", { code });
      // const response = await axios.post("http://localhost:8000/api/question/grading/2", { code });
      const testResult = response.data;
      if (testResult.some((result) => result === false)) {
        alert("테스트를 통과하지 못했습니다.");
        return;
      } else {
        socket.emit("playerWin", { roomname: "firstRoom" });
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

  const handleToMessage = ({ target }) => {
    setMessage(target.value);
  };

  const onChangeCode = (value) => {
    setCode(value);
  };

  console.log(question);
  return (
    <Container>
      <QnA question={question} onChangeCode={onChangeCode} code={code} />
      <button onClick={submit}>제출</button>
      <Result codeError={codeError} />
      {/* <ChatContainer>
        {chat.map((msg) => {
          return <p>{msg}</p>;
        })}
      </ChatContainer> */}
      {/* <input onChange={handleToMessage} /> */}
      {/* <button onClick={() => sendMessage(message)}>전송</button> */}
      <button onClick={createRoom}>생성</button>
      <button onClick={joinRoom}>입장</button>
    </Container>
  );
}
