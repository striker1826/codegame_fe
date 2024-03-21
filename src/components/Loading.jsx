import { styled } from "styled-components";
import { Oval } from "react-loader-spinner";

const StyledLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 150%);

  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin-top: 50px;
    font-size: 20px;
  }
`;

export const Loading = () => {
  const LoadingProgress = <Oval secondaryColor="#D9D9D9" color="#FF922D" height={94} width={94} strokeWidth={7} />;

  return (
    <StyledLoading>
      {LoadingProgress}
      <p>방을 생성중입니다. 잠시만 기다려 주세요</p>
    </StyledLoading>
  );
};
