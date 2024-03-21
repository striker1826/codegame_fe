import { styled } from "styled-components";

const RoomContainer = styled.div`
  display: flex;
  padding: 50px;
  gap: 20px;
`;

const StyledRoom = styled.button`
  width: 120px;
  height: 120px;
  border: none;
  background-color: #b4c3ff;
  color: #fff;
`;

export const RoomList = ({ roomList, joinRoom }) => {
  return (
    <RoomContainer>
      {roomList.map((room) => {
        return <Room room={room} joinRoom={joinRoom} />;
      })}
    </RoomContainer>
  );
};

export const Room = ({ room, joinRoom }) => {
  return (
    <StyledRoom key={room.roomId} onClick={() => joinRoom(room.roomname)}>
      <p>방 제목: {room.roomname}</p>
      <p>방 인원: {room.count}/2</p>
    </StyledRoom>
  );
};
