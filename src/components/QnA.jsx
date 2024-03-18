import { useState } from "react";
import { styled } from "styled-components";
import { CodingEditor } from "./CodingEditor";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  flex-direction: column;
`;

const Question = styled.div`
  padding: 30px;
  width: 100%;
  color: #fff;
  background-color: #5050ff;
`;

export const QnA = ({ question, code, onChangeCode }) => {
  return (
    <Container>
      <Question>
        <p>{question}</p>
      </Question>
      <CodingEditor code={code} onChange={onChangeCode} />
    </Container>
  );
};
