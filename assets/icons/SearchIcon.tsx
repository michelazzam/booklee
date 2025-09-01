import Svg, { Path } from 'react-native-svg';

import { IconProps } from '~/types/Icons/IconType';

export default function SearchIcon({ color = '#1F1F1F', width = 24, height = 24 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={width} height={height}>
      <Path
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
