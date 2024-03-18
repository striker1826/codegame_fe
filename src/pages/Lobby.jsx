import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { CodingRoom } from "./CodingRoom";
import { GithubLogin } from "../components/auth/GithubLogin";

const BASE_URL = "https://minseob-codegame.koyeb.app";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomname, setRoomname] = useState("");

  const createRoom = async () => {
    const res = await axios.post(`${BASE_URL}/api/room`, { roomname });
    const roomData = res.data;
    window.location.href = `/codingroom?roomname=${roomData.roomname}&key=${"create"}`;
  };

  const joinRoom = (roomname) => {
    window.location.href = `/codingroom?roomname=${roomname}&key=${"join"}`;
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
  // =======================================================

  useEffect(() => {
    const getRoomList = async () => {
      const res = await axios.get(`${BASE_URL}/api/room/list`);
      const data = res.data;
      setRoomList((prev) => {
        return [...prev, ...data];
      });
    };

    getRoomList();
  }, []);

  const onChangeRoomname = ({ target }) => {
    setRoomname(target.value);
  };

  return (
    <Container>
      {roomList.map((room) => {
        return (
          <button key={room.roomId} onClick={() => joinRoom(room.roomname)}>
            <p>{room.roomname}</p>
          </button>
        );
      })}
      <div style={{ marginTop: "60px" }}>
        <input type="text" onChange={onChangeRoomname} />
        <button onClick={createRoom}>방 생성</button>
      </div>
    </Container>
  );
};
