import { useEffect, useState, useCallback } from 'react';

type TimerConfig = {
  tokenExpiryMinutes: number;
  resendEmailMinutes: number;
};

export const useTimer = ({ tokenExpiryMinutes, resendEmailMinutes }: TimerConfig) => {
  const [tokenExpiry, setTokenExpiry] = useState(tokenExpiryMinutes * 60);
  const [resendEmailTimerSeconds, setResendEmailTimerSeconds] = useState(resendEmailMinutes * 60);

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
      setResendEmailTimerSeconds((prev) => {
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
  }, [tokenExpiryMinutes, resendEmailMinutes]);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const resetTimer = () => {
    setTokenExpiry(tokenExpiryMinutes * 60);
    setResendEmailTimerSeconds(resendEmailMinutes * 60);
  };

  const formattedTokenExpiry = formatTime(tokenExpiry);
  const formattedResendEmailTimer = formatTime(resendEmailTimerSeconds);

  return {
    resetTimer,
    resendEmailTimerSeconds,
    formattedResendEmailTimer,
    formattedTokenExpiry,
  };
};
