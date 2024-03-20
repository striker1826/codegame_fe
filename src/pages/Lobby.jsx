import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const BASE_URL = "https://battlecode.shop";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoomContainer = styled.div`
  display: flex;
`;

const StyledRoom = styled.button`
  width: 100px;
  height: 100px;
  border: none;
  background-color: #b4c3ff;
  corlor: #fff;
`;

export const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomname, setRoomname] = useState("");

  const createRoom = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/room`, { roomname });
      const roomData = res.data;
      window.location.href = `/codingroom?roomname=${roomData.roomname}&key=${"create"}`;
    } catch (err) {
      const status = err.response.status;
      if (status === 400) {
        alert("이미 존재하는 방 이름입니다. 다른 이름을 입력해주세요.");
      }
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
      <RoomContainer>
        {roomList.map((room) => {
          return (
            <StyledRoom key={room.roomId} onClick={() => joinRoom(room.roomname)}>
              <p>{room.roomname}</p>
              <p>{room.count}/2</p>
            </StyledRoom>
          );
        })}
      </RoomContainer>
      <div style={{ marginTop: "60px" }}>
        <input type="text" maxLength={8} onChange={onChangeRoomname} />
        <button onClick={createRoom}>방 생성</button>
      </div>
    </Container>
  );
};
