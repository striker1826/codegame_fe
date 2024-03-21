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
  padding: 30px 20px;
  width: 100%;
  color: #fff;
  background: #2666cf;

  p {
    font-size: 18px;
    font-weight: 500;
    line-height: 150%; /* 36px */
  }
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
