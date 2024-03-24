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
    </Container>
  );
};
