import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #2666cf;
  background: rgba(38, 102, 207, 0.1);
`;

const StyledPTag = styled.p`
  color: #093a8b;
  font-size: 18px;
  font-wieght: 500;
`;

export const TestCase = ({ testCase, index }) => {
  return (
    <>
      <StyledPTag>
        {index}번<br />
        input:{testCase.input} <br />
        output: {testCase.output}
      </StyledPTag>
    </>
  );
};

export const TestCaseList = ({ testCases }) => {
  return (
    <Container>
      {testCases.map((testCase, i) => {
        return <TestCase key={i} testCase={testCase} index={i} />;
      })}
    </Container>
  );
};
