import Svg, { Path } from 'react-native-svg';
import { IconProps } from './IconType';

export default function ChevronDownIcon({ color = '#1F1F1F', width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M17 11l-5 5-5-5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
