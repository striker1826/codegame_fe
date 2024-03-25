import { styled } from "styled-components";
import { Oval } from "react-loader-spinner";

const StyledLoading = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -20%);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDiv = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: pink;
`;

const StyledText = styled.span`
  margin-top: 50px;
  font-size: 20px;
  color: #093a8b;
`;

export const Loading = ({ text }) => {
  const LoadingProgress = <Oval secondaryColor="#D9D9D9" color="#FF922D" height={94} width={94} strokeWidth={7} />;

  return (
    <StyledLoading>
      {LoadingProgress}
      <StyledDiv>
        <StyledText>{text}</StyledText>
      </StyledDiv>
    </StyledLoading>
  );
};
