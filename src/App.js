import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { GithubLogin } from "./components/auth/GithubLogin";
import { CodingRoom } from "./pages/CodingRoom";
import { Redirect } from "./components/auth/Redirect";
import { Lobby } from "./pages/Lobby";
import { NotFoundPage } from "./pages/NotFound";

export const App = () => {
  const access_token = localStorage.getItem("access_token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GithubLogin />}></Route>
        <Route path="/lobby" element={access_token ? <Lobby /> : <GithubLogin />}></Route>
        <Route path="/codingroom" element={<CodingRoom />}></Route>
        <Route path="/github" element={<Redirect />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
