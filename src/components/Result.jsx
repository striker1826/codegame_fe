import { styled } from "styled-components";

const Container = styled.div`
  background-color: #ffdaab;
  margin-top: 30px;
`;

export const Result = ({ codeError }) => {
  return <Container>{codeError ? <p>{codeError}</p> : null}</Container>;
};
