import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';
import { FC } from 'react';

const ChevronRightIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M10 7l5 5-5 5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ChevronRightIcon;
