import axios from "axios";
import { styled } from "styled-components";

export const GithubLogin = () => {
  const githubLoginURL = `https://github.com/login/oauth/authorize?client_id=f43914b1d8d9e9a27d0f&redirect_uri=https://algorithmcodegame.netlify.app/github`;
  const handleLogin = () => {
    window.location.href = githubLoginURL;
  };

  return (
    <button style={{ marginTop: "30px" }} onClick={handleLogin}>
      깃허브로 로그인
    </button>
  );
};
