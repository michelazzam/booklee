import Svg, { Path } from 'react-native-svg';
import { IconProps } from '~/types/Icons/IconType';

export default function BookingIcon({ color = '#1F1F1F', width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2v3m8-3v3M3.5 9.09h17m-4.805 4.61h.009m-.01 3h.01m-3.709-3h.01m-.01 3h.01m-3.71-3h.008m-.009 3h.01M7 22h10a4 4 0 004-4V8a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
