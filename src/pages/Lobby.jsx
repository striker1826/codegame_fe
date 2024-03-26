import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { RoomList } from "../components/Lobby/RoomList";
import { Loading } from "../components/Loading";
import { patchApi, postApi } from "../api";
import { errorConfig } from "../errorConfig";
import { Survey } from "../components/Lobby/Survey";
import { CreateRoom } from "../components/Lobby/CreateRoom";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://battlecode.shop";
// const BASE_URL = "http://localhost:8000";

const socket = io.connect(BASE_URL);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
`;

export const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomname, setRoomname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (roomname === "") {
      alert("방 이름을 입력해주세요.");
      return;
    }
    const access_token = window.localStorage.getItem("access_token");
    try {
      setIsLoading(true);
      let result = await postApi("/api/room", { roomname, key: "created" }, access_token);
      window.location.href = `/codingroom?roomname=${result.roomname}&key=${"create"}`;
    } catch (err) {
      const status = err.response.status;
      const code = err.response.data.message;

      if (status === 401 && code === "Unauthorized") {
        window.localStorage.removeItem("access_token");
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/");
        window.location.reload();
      } else {
        alert(errorConfig[status][code]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomname) => {
    const access_token = window.localStorage.getItem("access_token");
    try {
      await patchApi("/api/room", { roomname, key: "joined" }, access_token);
      window.location.href = `/codingroom?roomname=${roomname}&key=${"join"}`;
    } catch (err) {
      const status = err.response.status;
      const code = err.response.data.message;

      if (status === 401 && code === null) {
        window.localStorage.removeItem("access_token");
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert(errorConfig[status][code]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("playerLose", (data) => {
      alert("you lose");
    });
  }, [socket]);

  useEffect(() => {
    socket.on("createdRoom", (data) => {
      const getRoomList = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/room/list`);
          const data = res.data;
          setRoomList((prev) => {
            return [...data];
          });
        } catch (err) {
          const status = err.response.status;
          const code = err.response.data.message;
          if (status === 401 && code === "Unauthorized") {
            window.localStorage.removeItem("access_token");
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            alert(errorConfig[status][code]);
          }
        }
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
      } catch (err) {
        const status = err.response.status;
        const code = err.response.data.message;
        console.log(err);
        if (status === 401 && code === null) {
          window.localStorage.removeItem("access_token");
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          alert(errorConfig[status][code]);
        }
      }
    };

    socket.emit("enterLobby", { access_token: window.localStorage.getItem("access_token") });
    getRoomList();
  }, []);

  const onChangeRoomname = ({ target }) => {
    setRoomname(target.value);
  };

  return (
    <Container>
      {isLoading && <Loading text={"방에 입장 중 입니다. 잠시만 기다려 주세요"} />}
      <RoomList roomList={roomList} joinRoom={joinRoom} />
      <CreateRoom isLoading={isLoading} createRoom={createRoom} onChangeRoomname={onChangeRoomname} />
      <Survey />
    </Container>
  );
};
