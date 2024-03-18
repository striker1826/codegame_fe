import axios from "axios";
import { styled } from "styled-components";
import githubMark from "../../imgs/github-mark.png";
import githubLogo from "../../imgs/GitHub_Logo.png";

const REDIRECT_URI = "https://algorithmcodegame.netlify.app/github";
const LOCAL_REDIRECT_URI = "http://localhost:3000/github";

const Container = styled.div`
  width: 100wh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GithubBtn = styled.button`
  background-image: url(${githubMark});
  background-size: cover;
  border: none;
  background-color: #fff;
  padding: 10px;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const GithubText = styled.button`
  background-image: url(${githubLogo});
  background-size: cover;
  border: none;
  background-color: #fff;
  padding: 10px;
  width: 150px;
  height: 50px;
  cursor: pointer;
  margin-bottom: 10px;
`;

export const GithubLogin = () => {
  const githubLoginURL = `https://github.com/login/oauth/authorize?client_id=f43914b1d8d9e9a27d0f&redirect_uri=${REDIRECT_URI}`;
  const handleLogin = () => {
    window.location.href = githubLoginURL;
  };

  return (
    <Container>
      <LoginContainer onClick={handleLogin}>
        <GithubBtn />
        <GithubText />
        로그인 하기
      </LoginContainer>
    </Container>
  );
};
