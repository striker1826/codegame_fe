import { styled } from "styled-components";
import { Timer } from "../Timer";
import { GradeResultList } from "./GradeResult";
import { TestCaseList } from "./TestCase";
import { Result } from "./Result";
import { QnA } from "./QnA";

const Container = styled.div`
  background: rgba(38, 102, 207, 0.1);
  padding: 50px;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const BtnContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 50px;
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

const Waiting = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  p {
    text-align: center;
    width: 480px;
    height: 50px;
    font-size: 25px;
    font-weight: bold;
    transform: translate(-50%, -50%);
  }
`;

export const GamePage = ({
  isTimer,
  codeInfo,
  setIsEnd,
  onChangeCode,
  isGrading,
  SubmitComponent,
  GradeResult,
  handleLeaveRoom,
  codeError,
  testCases,
  isReady,
}) => {
  return (
    <Container>
      {isTimer && <Timer limit={codeInfo.limit} setIsEnd={setIsEnd} />}
      <QnA question={codeInfo.question} onChangeCode={onChangeCode} code={codeInfo.code} />
      <BtnContainer>
        {isGrading ? <Btn>채점중...</Btn> : SubmitComponent}
        <Btn onClick={handleLeaveRoom}>방 나가기</Btn>
      </BtnContainer>
      {isReady && (
        <Waiting>
          <p>다른 사람이 준비를 완료할때까지 기다려 주세요.</p>
        </Waiting>
      )}
      {testCases[0] && <TestCaseList testCases={testCases} />}
      {codeError && <Result codeError={codeError} />}
      {GradeResult[0] && <GradeResultList gradeResult={GradeResult} />}
    </Container>
  );
};
