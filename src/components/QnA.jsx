import { useState } from "react";
import { styled } from "styled-components";
import { CodingEditor } from "./CodingEditor";

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Question = styled.div`
  width: 500px;
  height: 200px;
  background-color: #5050ff;
`;

export const QnA = ({ question, code, onChangeCode }) => {
  console.log(question);
  return (
    <Container>
      <Question>
        <p>{question}</p>
      </Question>
      <CodingEditor code={code} onChange={onChangeCode} />
    </Container>
  );
};
