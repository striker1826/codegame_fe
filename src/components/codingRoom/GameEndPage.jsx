import { styled } from "styled-components";

const Container = styled.div`
  background-color: #b4c3ff;
  padding: 30px 50px;
  width: 100%;
  height: 100vh;
`;

const Btn = styled.button`
  color: #fff;
  background-color: #000;
  text-align: center;
  width: 100px;
  padding: 10px;
  border: none;
  cursor: pointer;
`;

const BtnContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

export const GameEndPage = ({ isLeaveRoom, onClickRoomReset, onClickLeaveRoom, ReReadyComponent }) => {
  return (
    <Container>
      <BtnContainer>
        {isLeaveRoom ? <Btn onClick={onClickRoomReset}>방 초기화</Btn> : ReReadyComponent}
        <Btn onClick={onClickLeaveRoom}>방 나가기</Btn>
      </BtnContainer>
    </Container>
  );
};
