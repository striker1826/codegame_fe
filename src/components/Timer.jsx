import { useEffect, useState } from "react";

const getSeconds = (time) => {
  const seconds = Number(time % 60);
  if (seconds < 10) {
    return "0" + String(seconds);
  } else {
    return String(seconds);
  }
};

export const Timer = ({ limit, setIsEnd }) => {
  console.log(limit);
  const [time, setTime] = useState(limit); // 남은 시간 (단위: 초)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time]); // 빈 의존성 배열로 설정하여 처음 한 번만 실행되도록 함

  useEffect(() => {
    if (time < 0) {
      alert("Time OVER!");
      setIsEnd(true);
    }
  }, [time]); // time이 변경될 때마다 실행되도록 설정

  return (
    <div>
      <h1>남은 시간</h1>
      <div>
        <span>{parseInt(time / 60)}</span>
        <span> : </span>
        <span>{getSeconds(time)}</span>
      </div>
    </div>
  );
};
