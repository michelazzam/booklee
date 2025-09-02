import { useEffect, useState, useCallback } from "react";

export const useTimer = (
  initialTokenTime: number,
  initialEmailTime: number = 60
) => {
  const [tokenExpiry, setTokenExpiry] = useState(initialTokenTime * 60);
  const [resendEmailTimer, setResendEmailTimer] = useState(initialEmailTime);

  useEffect(() => {
    const tokenInterval = setInterval(() => {
      setTokenExpiry((prev) => {
        if (prev === 0) {
          clearInterval(tokenInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const emailInterval = setInterval(() => {
      setResendEmailTimer((prev) => {
        if (prev === 0) {
          clearInterval(emailInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(emailInterval);
    };
  }, [initialTokenTime, initialEmailTime]);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const resetTimer = () => {
    setTokenExpiry(initialTokenTime * 60);
    setResendEmailTimer(initialEmailTime);
  };

  const formattedTokenExpiry = formatTime(tokenExpiry);

  return {
    resetTimer,
    resendEmailTimer,
    formattedTokenExpiry,
  };
};
