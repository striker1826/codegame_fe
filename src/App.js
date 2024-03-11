import { styled } from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const CodeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
`;

const StyledTextarea = styled.textarea`
  width: 50%;
  height: 400px;
`;

const TestResultDiv = styled.div`
  // width: 400px;
  // height: 400px;
`;

function App() {
  const [value, setValue] = useState(`function solution(n) {

  }`);
  const [testResult, setTestResult] = useState([]);

  const [question, setQuestion] = useState();

  const onChange = useCallback((val) => {
    setValue(val);
  }, []);

  useEffect(() => {
    const getQuestion = async () => {
      const response = await axios.get("http://localhost:8000/question");
      const question = response.data.question;
      setQuestion(question);
    };

    getQuestion();
  }, []);

  const submit = async () => {
    const response = await axios.post("http://localhost:8000/question/grading/2", {
      code: value,
    });
    const testResult = response.data;
    console.log(testResult);
    setTestResult((prev) => {
      return [...testResult];
    });
  };

  return (
    <>
      <CodeContainer>
        <StyledTextarea value={question}></StyledTextarea>
        <CodeMirror
          value={value}
          height="200px"
          width="500px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
      </CodeContainer>
      <button onClick={submit}>제출</button>
      {testResult.map((result, i) => {
        return (
          <TestResultDiv key={i}>
            <h3>Test {i + 1}</h3>
            <p>Result: {result.result}</p>
          </TestResultDiv>
        );
      })}
    </>
  );
}

export default App;
