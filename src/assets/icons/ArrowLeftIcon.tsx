import Svg, { Path } from 'react-native-svg';
import { IconType } from './IconType';
import { FC } from 'react';

const ArrowLeftIcon: FC<IconType> = ({ color = '#1F1F1F', width = 24, height = 24 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
