import { IconProps } from '~/types/Icons/IconType';
import Svg, { Mask, G, Path, Defs, ClipPath } from 'react-native-svg';

export default function GoogleIcon({ width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_268_2799)">
        <Mask
          id="a"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}>
          <Path
            d="M23.557 9.818H12.375v4.637h6.436c-.6 2.945-3.109 4.636-6.436 4.636A7.077 7.077 0 015.285 12a7.077 7.077 0 017.09-7.09c1.69 0 3.218.6 4.418 1.58L20.284 3c-2.127-1.855-4.854-3-7.909-3-6.655 0-12 5.345-12 12s5.345 12 12 12c6 0 11.455-4.364 11.455-12 0-.71-.11-1.473-.273-2.182z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#a)">
          <Path d="M-.716 19.091V4.909L8.557 12l-9.273 7.091z" fill="#FBBC05" />
        </G>
        <Mask
          id="b"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}>
          <Path
            d="M23.557 9.818H12.375v4.637h6.436c-.6 2.945-3.109 4.636-6.436 4.636A7.077 7.077 0 015.285 12a7.077 7.077 0 017.09-7.09c1.69 0 3.218.6 4.418 1.58L20.284 3c-2.127-1.855-4.854-3-7.909-3-6.655 0-12 5.345-12 12s5.345 12 12 12c6 0 11.455-4.364 11.455-12 0-.71-.11-1.473-.273-2.182z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#b)">
          <Path d="M-.716 4.91L8.557 12l3.818-3.327 13.091-2.127v-7.637H-.716v6z" fill="#EA4335" />
        </G>
        <Mask
          id="c"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}>
          <Path
            d="M23.557 9.818H12.375v4.637h6.436c-.6 2.945-3.109 4.636-6.436 4.636A7.077 7.077 0 015.285 12a7.077 7.077 0 017.09-7.09c1.69 0 3.218.6 4.418 1.58L20.284 3c-2.127-1.855-4.854-3-7.909-3-6.655 0-12 5.345-12 12s5.345 12 12 12c6 0 11.455-4.364 11.455-12 0-.71-.11-1.473-.273-2.182z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#c)">
          <Path
            d="M-.716 19.091L15.648 6.546l4.309.545 5.509-8.182v26.182H-.716v-6z"
            fill="#34A853"
          />
        </G>
        <Mask
          id="d"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}>
          <Path
            d="M23.557 9.818H12.375v4.637h6.436c-.6 2.945-3.109 4.636-6.436 4.636A7.077 7.077 0 015.285 12a7.077 7.077 0 017.09-7.09c1.69 0 3.218.6 4.418 1.58L20.284 3c-2.127-1.855-4.854-3-7.909-3-6.655 0-12 5.345-12 12s5.345 12 12 12c6 0 11.455-4.364 11.455-12 0-.71-.11-1.473-.273-2.182z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#d)">
          <Path d="M25.466 25.091l-16.91-13.09-2.181-1.637 19.09-5.455v20.182z" fill="#4285F4" />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_268_2799">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
