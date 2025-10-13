import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { AuthServices } from '~/src/services';

import { VIDEOS } from '~/src/constants';

const SplashVideo = () => {
  /*** Constants ***/
  const router = useRouter();
  const { isFetched: isUserFetched } = AuthServices.useGetMe();
  const { isAuthenticated, isLoading: isAuthLoading } = AuthServices.useGetBetterAuthUser();

  const player = useVideoPlayer(VIDEOS.splash, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setTimeout(() => {
        router.replace('/(unauthenticated)/onboarding');
      }, 1000);
      return;
    }

    if (!isUserFetched) {
      setTimeout(() => {
        router.replace('/(unauthenticated)/onboarding');
      }, 1000);
    }
  }, [isUserFetched, isAuthenticated, router, isAuthLoading]);

  return (
    <VideoView
      player={player}
      contentFit="cover"
      nativeControls={false}
      style={StyleSheet.absoluteFillObject}
    />
  );
};

export default SplashVideo;
