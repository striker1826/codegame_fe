import { styled } from "styled-components";

const Container = styled.div`
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
  background: ${({ $color }) => (!$color ? "#2666cf" : "gray")};
  color: #fff;
  cursor: pointer;
`;

export const CreateRoom = ({ onChangeRoomname, isLoading, createRoom }) => {
  return (
    <Container>
      <input type="text" maxLength={10} onChange={onChangeRoomname} />
      <StyledBtn $color={isLoading} onClick={createRoom} disabled={isLoading}>
        방 생성
      </StyledBtn>
    </Container>
  );
};
