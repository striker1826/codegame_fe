import { styled } from "styled-components";

const Container = styled.div`
  width: 400px;
  height: 400px;
`;

export const Result = ({ codeError }) => {
  return <Container>{codeError ? <p>{codeError}</p> : null}</Container>;
};
