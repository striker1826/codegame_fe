import { styled } from "styled-components";

const NotFoundPageContainer = styled.div``;

const NotFoundMessage = styled.h1`
  font-size: 60px;
  color: #2666cf;
  text-align: center;
  margin-top: 20%;
`;

export const NotFoundPage = () => {
  return (
    <NotFoundPageContainer>
      <NotFoundMessage>404 - Not Found</NotFoundMessage>
    </NotFoundPageContainer>
  );
};
