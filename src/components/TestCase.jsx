import { styled } from "styled-components";

const Container = styled.div`
  background-color: #5050ff;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

export const TestCase = ({ testCase, index }) => {
  return (
    <div>
      <p>{index}번</p>
      <p>
        input:{testCase.input}, output: {testCase.output}
      </p>
    </div>
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
