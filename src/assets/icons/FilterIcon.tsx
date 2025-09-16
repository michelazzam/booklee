import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';
import { FC } from 'react';

const FilterIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 12h2m-2 0a2 2 0 10-4 0m4 0a2 2 0 11-4 0M6 6a2 2 0 104 0M6 6a2 2 0 114 0M6 6H4m6 0h10m-6 6H4m2 6a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0H4m6 0h10"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FilterIcon;
