import { Svg, Path } from 'react-native-svg';
import { FC } from 'react';

import { IconType } from './IconType';

const ClockIcon: FC<IconType> = ({ width = 22, height = 22, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        stroke="#1F1F1F"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 5V8L10.25 10.25M14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8C1.25 4.27208 4.27208 1.25 8 1.25C11.7279 1.25 14.75 4.27208 14.75 8Z"
      />
    </Svg>
  );
};

export default ClockIcon;
