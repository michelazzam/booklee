import { FC } from 'react';
import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';

const DoneStepIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
   <Svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"

    >
      <Path
        d="M11.25 6A5.25 5.25 0 11.75 6a5.25 5.25 0 0110.5 0z"
        fill={color}
      />
      <Path
        d="M4.25 6l1.167 1.167L7.75 4.833M11.25 6A5.25 5.25 0 11.75 6a5.25 5.25 0 0110.5 0z"
        stroke={"#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default DoneStepIcon;
