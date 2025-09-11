import { FC } from 'react';
import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';

const PhoneIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.778C4 4.796 4.796 4 5.778 4h2.915c.382 0 .722.245.843.608l1.331 3.994c.14.42-.05.878-.445 1.076l-2.007 1.003a9.815 9.815 0 004.904 4.904l1.003-2.007a.889.889 0 011.076-.445l3.994 1.331c.363.121.608.46.608.843v2.915c0 .982-.796 1.778-1.778 1.778h-.889C9.97 20 4 14.03 4 6.667v-.89z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PhoneIcon;
