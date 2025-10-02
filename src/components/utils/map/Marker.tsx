import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Marker as MapMarker } from 'react-native-maps';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { theme } from '~/src/constants/theme';

export type MarkerDataType = {
  _id: string;
  rating: number;
  latitude: number;
  longitude: number;
};

type MarkerProps = {
  data: MarkerDataType;
  onPress: (_id: string) => void;
};
const Marker = ({ data, onPress }: MarkerProps) => {
  /*** Constants ***/
  const { _id, rating, latitude, longitude } = data;

  /*** States ***/
  const [tracks, setTracks] = useState(true);

  const handleLayout = useCallback(() => {
    requestAnimationFrame(() => setTimeout(() => setTracks(false), 50));
  }, []);

  return (
    <MapMarker
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracks}
      onPress={() => onPress(_id)}
      coordinate={{ latitude, longitude }}>
      <View onLayout={handleLayout}>
        <Svg width={32} height={40} viewBox="0 0 32 40">
          <Path
            fill="rgba(0,0,0,0.3)"
            transform="translate(1, 1)"
            d="M16 37C16 37 4 28 4 14C4 7.163 9.163 4 16 4C22.837 4 28 7.163 28 14C28 28 16 37 16 37Z"
          />

          <Path
            strokeWidth="2"
            fill={theme.colors.darkText[100]}
            stroke={theme.colors.white.DEFAULT}
            d="M16 35C16 35 4 26 4 12C4 5.163 9.163 2 16 2C22.837 2 28 5.163 28 12C28 26 16 35 16 35Z"
          />

          <Path d="M16 35L14 40L18 40Z" fill={theme.colors.darkText[100]} />

          <SvgText
            x="16"
            y="18"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fill={theme.colors.white.DEFAULT}>
            {Number(rating ?? 0).toFixed(1)}
          </SvgText>
        </Svg>
      </View>
    </MapMarker>
  );
};

export default Marker;
