import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { RoomList } from "../components/Lobby/RoomList";
import { Loading } from "../components/Loading";

const BASE_URL = "https://battlecode.shop";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
`;

const CreateRoom = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;

  input {
    width: 200px;
  }
`;

const StyledBtn = styled.button`
  width: 200px;
  height: 20px;
  border: none;
  background: ${(props) => (props.btnColor === false ? "#2666cf" : "gray")};
  color: #fff;
  cursor: pointer;
`;

const Survey = styled.div`
  background: rgba(38, 102, 207, 0.1);
  border-radius: 10px;
  border: 1px solid #2666cf;
  width: 500px;
  height: 100%;
  margin-top: 70px;
  padding: 20px;

  p {
    text-align: center;
    color: #093a8b;
    font-size: 18px;
    font-wieght: 500;
  }

  a {
    margin-top: 20px;
    text-decoration: none;
    display: block;
    text-align: center;
    font-size: 24px;
    font-wieght: 500;
  }

  @media (max-width: 768px) {
    width: 90%;
    height: 100%;
  }
`;

export const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomname, setRoomname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async () => {
    try {
      if (roomname === "") {
        alert("방 이름을 입력해주세요.");
        return;
      }
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}/api/room`, { roomname });
      const roomData = res.data;
      console.log(roomData);
      window.location.href = `/codingroom?roomname=${roomData.roomname}&key=${"create"}`;
    } catch (err) {
      const status = err.response.status;
      if (status === 400) {
        alert("이미 존재하는 방 이름입니다. 다른 이름을 입력해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomname) => {
    try {
      await axios.patch(`${BASE_URL}/api/room`, { roomname });
      window.location.href = `/codingroom?roomname=${roomname}&key=${"join"}`;
    } catch (err) {
      const status = err.response.status;
      if (status === 400) {
        alert("방이 꽉 찼습니다.");
        return;
      }

      if (status === 401) {
        alert("이미 시작한 방입니다.");
        return;
      }
    }
  };

  // socket useEffect
  useEffect(() => {
    socket.on("joinRoom", (data) => {});
  }, [socket]);

  useEffect(() => {
    socket.on("playerLose", (data) => {
      alert("you lose");
    });
  }, [socket]);

  useEffect(() => {
    socket.on("createdRoom", (data) => {
      const getRoomList = async () => {
        const res = await axios.get(`${BASE_URL}/api/room/list`);
        const data = res.data;
        setRoomList((prev) => {
          return [...data];
        });
      };

      getRoomList();
    });
  }, [socket]);
  // =======================================================

  useEffect(() => {
    const getRoomList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/room/list`);
        const data = res.data;
        setRoomList((prev) => {
          return [...prev, ...data];
        });
      } catch (err) {}
    };

    socket.emit("enterLobby", () => {});
    getRoomList();
  }, []);

  const onChangeRoomname = ({ target }) => {
    setRoomname(target.value);
  };

  return (
    <Container>
      {isLoading && <Loading />}
      <RoomList roomList={roomList} joinRoom={joinRoom} />
      <CreateRoom>
        <input type="text" maxLength={8} onChange={onChangeRoomname} />
        <StyledBtn btnColor={isLoading} onClick={createRoom} disabled={isLoading}>
          방 생성
        </StyledBtn>
      </CreateRoom>
      <Survey>
        <p>
          설문 참여자 분들 중 5명을 추첨하여
          <br /> 기프트콘을 보내드립니다.
        </p>
        <a target="_blank" href="https://docs.google.com/forms/d/1XgQ57txpIqVzi70QXNTxoT43mWzJRFZ-wy7NBCZWa9c/edit">
          설문조사 참여하기
        </a>
      </Survey>
    </Container>
  );
};
