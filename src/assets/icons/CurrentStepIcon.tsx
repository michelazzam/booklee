import { FC } from 'react';
import { Svg, Circle } from 'react-native-svg';
import { IconType } from './IconType';

const CurrentStepIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
     <Svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
 
    >
      <Circle
        cx={7}
        cy={7}
        r={5.25}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
        <Circle cx={7.00016} cy={7.00016} r={2.91667} fill={color} />
    </Svg>
  );
};

export default CurrentStepIcon;
