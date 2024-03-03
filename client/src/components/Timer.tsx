import React, { useState, useEffect } from "react";

interface Props {
  time: number;
  onComplete: () => void;
}
const Timer: React.FC<Props> = ({ time, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState(time);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);
    if (remainingTime === 0) {
      clearInterval(interval);
      onComplete();
    }
    return () => {
      clearInterval(interval);
    };
  }, [remainingTime, onComplete]);
  React.useEffect(() => {
    setRemainingTime(time);
  }, [time]);
  console.log(remainingTime);
  if (remainingTime === 0) return null;
  return (
    <p className="text-center">
      Resend OTP in{" "}
      <span className="font-semibold text-sky-600">{remainingTime}</span>{" "}
      seconds
    </p>
  );
};

export default Timer;
