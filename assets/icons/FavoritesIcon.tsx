import Svg, { Path } from 'react-native-svg';
import { IconProps } from '~/types/Icons/IconType';

export default function FavoritesIcon({ color = '#1F1F1F', width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 3v10.684c0 2.109-1.128 2.933-2.512 1.82l-1.056-.846a.718.718 0 00-.864 0l-1.056.846C9.128 16.605 8 15.793 8 13.684V3M7 21h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
