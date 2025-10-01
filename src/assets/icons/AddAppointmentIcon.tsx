import { FC } from 'react';
import { Svg, Path } from 'react-native-svg';
import { IconType } from './IconType';

const AddAppointmentIcon: FC<IconType> = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 14.5v-6c0-3-1.5-5-5-5H8c-3.5 0-5 2-5 5V17c0 3 1.5 5 5 5h5m8-3h-6m3-3v6M3.5 9.09h17m-8.505 4.61h.01m-3.71 0h.008m-.009 3h.01M8 2v3m8-3v3"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AddAppointmentIcon;
