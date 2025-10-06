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
        <Svg width={40} height={40} viewBox="0 0 68 58">
          <Path
            fill={theme.colors.darkText[100]}
            stroke={theme.colors.white.DEFAULT}
            strokeWidth={2}
            strokeLinejoin="round"
            d="
                M34 56
                C34 48 22 40 14 20
                A20 20 0 1 1 54 20
                C46 40 34 48 34 56
                Z"
          />

          {/* Rating text */}
          <SvgText
            y="24"
            x="34"
            fontSize="12"
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
