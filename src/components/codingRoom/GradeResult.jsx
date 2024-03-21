import { styled } from "styled-components";

const GradeContainer = styled.div`
  background-color: #5050ff;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  height: 100%;
`;

export const GradeResult = ({ index, result }) => {
  return (
    <p>
      <strong>{index}: </strong>
      {result}
    </p>
  );
};

export const GradeResultList = ({ gradeResult, testCases }) => {
  return (
    <GradeContainer>
      {gradeResult.map((grade, i) => {
        return <GradeResult key={grade.testCaseId} index={i} result={grade.result} />;
      })}
    </GradeContainer>
  );
};
