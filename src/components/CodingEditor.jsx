import { styled } from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";

export const CodingEditor = ({ code, onChange }) => {
  return (
    <CodeMirror value={code} height="200px" width="500px" extensions={[javascript(), java()]} onChange={onChange} />
  );
};
