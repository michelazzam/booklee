import Svg, { Path } from 'react-native-svg';
import { IconProps } from '~/types/Icons/IconType';

export default function ArrowLeftIcon({ color = '#1F1F1F', width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
