import { styled } from "styled-components";

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
      <p>{room.roomname}</p>
      <p>{room.count}/2</p>
    </StyledRoom>
  );
};
