import { FC } from 'react';
import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';

const UserInfoIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.08 2.232l-4.99 1.87C3.94 4.532 3 5.893 3 7.123v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44v-7.43c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.59 10.922h-.13c-.94-.03-1.69-.81-1.69-1.76 0-.97.79-1.76 1.76-1.76s1.76.79 1.76 1.76c-.01.96-.76 1.73-1.7 1.76zM9.59 13.672c-.96.64-.96 1.69 0 2.33 1.09.73 2.88.73 3.97 0 .96-.64.96-1.69 0-2.33-1.08-.73-2.87-.73-3.97 0z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UserInfoIcon;
