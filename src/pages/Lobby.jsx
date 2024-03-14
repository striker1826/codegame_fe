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
  const [enterRoom, setEnterRoom] = useState(false);

  // socket useEffect
  const createRoom = () => {
    socket.emit("createRoom", { roomname });
    setEnterRoom(true);
  };

  const joinRoom = (roomId, roomname) => {
    socket.emit("joinRoom", { roomId, roomname });
    setEnterRoom(true);
  };

  // socket on functions ===================================
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
    <>
      {enterRoom ? (
        <CodingRoom socket={socket} />
      ) : (
        roomList.map((room) => {
          console.log(room);
          return (
            <Container key={room.roomId}>
              <button onClick={() => joinRoom(room.roomId, room.roomname)}>
                <p>{room.roomname}</p>
              </button>
            </Container>
          );
        })
      )}
      <div style={{ marginTop: "60px" }}>
        <input type="text" onChange={onChangeRoomname} />
        <button onClick={createRoom}>방 생성</button>
      </div>
    </>
  );
};
