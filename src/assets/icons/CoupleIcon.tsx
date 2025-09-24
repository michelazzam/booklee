import Svg, { Path } from 'react-native-svg';
import { IconType } from './IconType';
import { FC } from 'react';

const CoupleIcon: FC<IconType> = ({ color = '#1F1F1F', width = 24, height = 24 }) => {
  return (
       <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"

    >
      <Path
        d="M16.41 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 00-.26 0m2.06 9c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86m-9.21-3.13c-.1-.01-.22-.01-.33 0a4.42 4.42 0 01-4.27-4.43C4.56 3.99 6.54 2 9 2a4.435 4.435 0 01.16 8.87zm-5 3.69c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CoupleIcon;
