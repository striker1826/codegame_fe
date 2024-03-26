import { styled } from "styled-components";

const Container = styled.div`
  background: rgba(38, 102, 207, 0.1);
  border-radius: 10px;
  border: 1px solid #2666cf;
  width: 500px;
  height: 100%;
  margin-top: 70px;
  padding: 20px;
  margin-bottom: 20px;

  p {
    text-align: center;
    color: #093a8b;
    font-size: 18px;
    font-wieght: 500;
  }

  a {
    margin-top: 20px;
    text-decoration: none;
    display: block;
    text-align: center;
    font-size: 24px;
    font-wieght: 500;
  }

  @media (max-width: 768px) {
    width: 90%;
    height: 100%;
  }
`;

export const Survey = () => {
  return (
    <Container>
      <p>
        설문 참여자 분들 중 5명을 추첨하여
        <br /> 기프트콘을 보내드립니다.
      </p>
      <a target="_blank" href="https://docs.google.com/forms/d/1XgQ57txpIqVzi70QXNTxoT43mWzJRFZ-wy7NBCZWa9c/edit">
        설문조사 참여하기
      </a>
    </Container>
  );
};
