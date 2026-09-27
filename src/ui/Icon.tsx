import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

export type IconName =
  | 'home'
  | 'sparkle'
  | 'calendar'
  | 'photo'
  | 'user'
  | 'plus'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'check'
  | 'checkCircle'
  | 'lock'
  | 'unlock'
  | 'mic'
  | 'send'
  | 'bell'
  | 'search'
  | 'sliders'
  | 'shield'
  | 'graph'
  | 'wallet'
  | 'box'
  | 'pill'
  | 'heart'
  | 'activity'
  | 'moon'
  | 'sun'
  | 'close'
  | 'trash'
  | 'edit'
  | 'clock'
  | 'cart'
  | 'leaf'
  | 'zap'
  | 'list'
  | 'download'
  | 'share'
  | 'more'
  | 'alert'
  | 'star'
  | 'brain'
  | 'house'
  | 'utensils'
  | 'footprints'
  | 'book'
  | 'refresh'
  | 'eye'
  | 'eyeOff'
  | 'link'
  | 'flame'
  | 'star2'
  | 'volume'
  | 'zapFilled'
  | 'cloud'
  | 'database'
  | 'info';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
};

export function Icon({ name, size = 22, color, strokeWidth = 2, filled }: Props) {
  const { t } = useTheme();
  const c = color ?? t.text;
  const common = {
    stroke: c,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {render(name, c, common, filled ?? false, size)}
    </Svg>
  );
}

function render(
  name: IconName,
  c: string,
  p: { stroke: string; strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round'; fill: string },
  filled: boolean,
  size: number
) {
  const fill = filled ? c : 'none';
  const sw = p.strokeWidth;

  switch (name) {
    case 'home':
      return <Path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" {...p} fill={fill} />;
    case 'house':
      return (
        <>
          <Path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" {...p} fill={fill} />
          <Path d="M10 20.5v-5h4v5" {...p} />
        </>
      );
    case 'sparkle':
      return (
        <>
          <Path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z" {...p} fill={filled ? c : 'none'} />
          <Path d="M18.5 16.5 19.2 19l2.3.7-2.3.7-.7 2.4-.7-2.4-2.3-.7 2.3-.7z" {...p} fill={filled ? c : 'none'} />
        </>
      );
    case 'brain':
      return (
        <Path
          d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.4A2.6 2.6 0 0 0 5.5 10c0 1 .5 1.8 1.3 2.3-.4.5-.6 1.1-.6 1.7A2.6 2.6 0 0 0 8 16.6V17a2.5 2.5 0 0 0 4.5 1.5V4.9a2.4 2.4 0 0 0-3-.4zm5 0a2.5 2.5 0 0 1 2.5 2.5V7a2.6 2.6 0 0 1 1.5 2.6c0 1-.5 1.8-1.3 2.3.4.5.6 1.1.6 1.7A2.6 2.6 0 0 1 16 15.4V17a2.5 2.5 0 0 1-4.5 1.5"
          {...p}
        />
      );
    case 'calendar':
      return (
        <>
          <Rect x={3.5} y={5.5} width={17} height={15} rx={5} {...p} fill={fill} />
          <Path d="M8 3.5v3.5M16 3.5v3.5M3.5 10.5h17" {...p} />
        </>
      );
    case 'photo':
      return (
        <>
          <Rect x={3.5} y={4.5} width={17} height={15} rx={5} {...p} fill={fill} />
          <Circle cx={9} cy={10} r={1.8} {...p} />
          <Path d="M4.5 17.5 9.5 13l3.5 3 3-2.5 4 4" {...p} />
        </>
      );
    case 'user':
      return (
        <>
          <Circle cx={12} cy={8.5} r={4} {...p} fill={fill} />
          <Path d="M4.5 20.2a7.6 7.6 0 0 1 15 0" {...p} />
        </>
      );
    case 'plus':
      return <Path d="M12 5.5v13M5.5 12h13" {...p} strokeWidth={p.strokeWidth + 0.3} />;
    case 'chevronRight':
      return <Path d="M9.5 5.5 16 12l-6.5 6.5" {...p} />;
    case 'chevronLeft':
      return <Path d="M14.5 5.5 8 12l6.5 6.5" {...p} />;
    case 'chevronDown':
      return <Path d="M5.5 9.5 12 16l6.5-6.5" {...p} />;
    case 'check':
      return <Path d="M5 12.5 10 17.5 19 7" {...p} strokeWidth={sw + 0.4} />;
    case 'checkCircle':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...p} fill={fill} />
          <Path d="M8.2 12.3 11 15.1l4.9-5" {...p} />
        </>
      );
    case 'lock':
      return (
        <>
          <Rect x={5} y={10.5} width={14} height={9.5} rx={4} {...p} fill={fill} />
          <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" {...p} />
        </>
      );
    case 'unlock':
      return (
        <>
          <Rect x={5} y={10.5} width={14} height={9.5} rx={4} {...p} fill={fill} />
          <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2" {...p} />
        </>
      );
    case 'eye':
      return (
        <>
          <Path d="M2.8 12S6 6.5 12 6.5 21.2 12 21.2 12 18 17.5 12 17.5 2.8 12 2.8 12z" {...p} />
          <Circle cx={12} cy={12} r={2.8} {...p} />
        </>
      );
    case 'eyeOff':
      return (
        <>
          <Path d="M4 5.5 20 18.5" {...p} />
          <Path d="M9.6 7.1A8.9 8.9 0 0 1 12 6.8c6 0 9.2 5.2 9.2 5.2a15 15 0 0 1-3.1 3.5M6.4 8.6A15.3 15.3 0 0 0 2.8 12S6 17.2 12 17.2a9 9 0 0 0 3.4-.65" {...p} />
        </>
      );
    case 'mic':
      return (
        <>
          <Rect x={9} y={3} width={6} height={11} rx={3} {...p} fill={fill} />
          <Path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" {...p} />
        </>
      );
    case 'volume':
      return (
        <>
          <Path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" {...p} fill={fill} />
          <Path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.5 7.5 0 0 1 0 10.4" {...p} />
        </>
      );
    case 'send':
      return <Path d="M20 4 3.5 11l7 2.6 2.6 7z" {...p} fill={fill} />;
    case 'bell':
      return (
        <>
          <Path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10z" {...p} fill={fill} />
          <Path d="M10 18.5a2.2 2.2 0 0 0 4 0" {...p} />
        </>
      );
    case 'search':
      return (
        <>
          <Circle cx={11} cy={11} r={6.5} {...p} />
          <Path d="m16 16 4 4" {...p} />
        </>
      );
    case 'sliders':
      return (
        <>
          <Path d="M5 7.5h14M5 12h14M5 16.5h14" {...p} />
          <Circle cx={9} cy={7.5} r={2.2} {...p} fill={fill} />
          <Circle cx={15} cy={12} r={2.2} {...p} fill={fill} />
          <Circle cx={8} cy={16.5} r={2.2} {...p} fill={fill} />
        </>
      );
    case 'shield':
      return <Path d="M12 3.5 19 6v6.2c0 4.3-3 7.3-7 8.3-4-1-7-4-7-8.3V6z" {...p} fill={fill} />;
    case 'graph':
      return (
        <>
          <Circle cx={6} cy={17.5} r={2.5} {...p} fill={fill} />
          <Circle cx={17.5} cy={15} r={2.5} {...p} fill={fill} />
          <Circle cx={12} cy={6} r={2.5} {...p} fill={fill} />
          <Path d="M12 8.5v3.5M10.4 13.6 7.6 16M13.6 13.4l2.6 1.9" {...p} />
        </>
      );
    case 'link':
      return (
        <Path
          d="M10 13.8a3.6 3.6 0 0 0 5.2.4l2.6-2.6a3.6 3.6 0 0 0-5.1-5.1l-1.3 1.3M14 10.2a3.6 3.6 0 0 0-5.2-.4l-2.6 2.6a3.6 3.6 0 0 0 5.1 5.1l1.3-1.3"
          {...p}
        />
      );
    case 'wallet':
      return (
        <>
          <Rect x={3.5} y={6} width={17} height={13} rx={4.5} {...p} fill={fill} />
          <Path d="M3.5 10.5h17" {...p} />
          <Circle cx={16.5} cy={14.5} r={1.3} {...p} />
        </>
      );
    case 'box':
      return (
        <>
          <Path d="M4 8.2 12 4l8 4.2v7.6L12 20l-8-4.2z" {...p} fill={fill} />
          <Path d="M4 8.2 12 12.4l8-4.2M12 12.4V20" {...p} />
        </>
      );
    case 'pill':
      return (
        <>
          <Rect x={2.6} y={8.4} width={18.8} height={7.2} rx={3.6} transform="rotate(-45 12 12)" {...p} fill={fill} />
          <Path d="M8.7 8.7 15.3 15.3" {...p} />
        </>
      );
    case 'heart':
      return (
        <Path
          d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.6 12 20 12 20z"
          {...p}
          fill={fill}
        />
      );
    case 'activity':
      return <Path d="M3.5 12.5h4l2.5-6 4 12 2.5-6h4" {...p} />;
    case 'moon':
      return <Path d="M19.5 14.8A8 8 0 0 1 9.2 4.5 8 8 0 1 0 19.5 14.8z" {...p} fill={fill} />;
    case 'sun':
      return (
        <>
          <Circle cx={12} cy={12} r={4.2} {...p} fill={fill} />
          <Path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5 7.2 7.2M16.8 16.8l1.7 1.7M18.5 5.5 16.8 7.2M7.2 16.8l-1.7 1.7" {...p} />
        </>
      );
    case 'close':
      return <Path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" {...p} />;
    case 'trash':
      return (
        <>
          <Path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2A1.5 1.5 0 0 0 8.9 20.5h6.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7" {...p} />
          <Path d="M10.5 11v5.5M13.5 11v5.5" {...p} />
        </>
      );
    case 'edit':
      return (
        <>
          <Path d="M4.5 19.5h4L20 8a2.1 2.1 0 0 0-3-3L5.5 16.5z" {...p} />
          <Path d="M14.5 5.5 18.5 9.5" {...p} />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...p} />
          <Path d="M12 7.5V12l3 2" {...p} />
        </>
      );
    case 'cart':
      return (
        <>
          <Path d="M3.5 4.5h2.2l2.3 10.2h9.2l2-7.2H6.8" {...p} />
          <Circle cx={9.5} cy={19} r={1.6} {...p} fill={fill} />
          <Circle cx={16.5} cy={19} r={1.6} {...p} fill={fill} />
        </>
      );
    case 'utensils':
      return (
        <>
          <Path d="M6.5 3.5v6a2.5 2.5 0 0 0 5 0v-6M9 3.5V11M9 11v9.5" {...p} />
          <Path d="M17.5 3.5c-1.4 1-2 2.7-2 4.6 0 1.6.7 2.6 2 3v9.4" {...p} />
        </>
      );
    case 'leaf':
      return (
        <>
          <Path d="M5 19c-2-6 1.5-12 8-13 3-.5 5.5 0 6 0 .5 4-1 8-5 9.5-3 1-6 0-6 0z" {...p} fill={fill} />
          <Path d="M5 19c2-4 5-7 9-8.5" {...p} />
        </>
      );
    case 'footprints':
      return (
        <>
          <Path d="M8 4.5c1.8 0 2.8 2 2.8 4.2S9.8 13 8 13s-2.8-2-2.8-4.3S6.2 4.5 8 4.5z" {...p} />
          <Path d="M6 15.5c1.4-.6 3.2-.6 4.4 0" {...p} />
          <Path d="M16 8.5c1.8 0 2.8 2 2.8 4.2s-1 4.3-2.8 4.3-2.8-2-2.8-4.3 1-4.2 2.8-4.2z" {...p} />
          <Path d="M14 19.5c1.4-.6 3.2-.6 4.4 0" {...p} />
        </>
      );
    case 'book':
      return (
        <>
          <Path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H11v16H6.5a2 2 0 0 0-2 2z" {...p} fill={fill} />
          <Path d="M19.5 5.5a2 2 0 0 0-2-2H13v16h4.5a2 2 0 0 1 2 2z" {...p} fill={fill} />
        </>
      );
    case 'zap':
      return <Path d="M13.5 3 5.5 13.5h5L10 21l8-10.5h-5z" {...p} fill={fill} />;
    case 'flame':
      return <Path d="M12 3.5s5 4.2 5 8.7a5 5 0 0 1-10 0c0-1.7.8-3 1.6-3.9.2 1.4 1 2.3 1.9 2.3 1.3 0 1.9-1.3 1.9-2.7 0-1.7-.4-3-.4-4.4z" {...p} fill={fill} />;
    case 'star':
      return <Path d="m12 4 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z" {...p} fill={fill} />;
    case 'alert':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...p} />
          <Path d="M12 7.5v5M12 16h.01" {...p} />
        </>
      );
    case 'zapFilled':
      return <Path d="M13.5 3 5.5 13.5h5L10 21l8-10.5h-5z" fill={c} />;
    case 'list':
      return (
        <>
          <Path d="M9 6.5h11M9 12h11M9 17.5h11" {...p} />
          <Circle cx={5} cy={6.5} r={1.4} fill={c} />
          <Circle cx={5} cy={12} r={1.4} fill={c} />
          <Circle cx={5} cy={17.5} r={1.4} fill={c} />
        </>
      );
    case 'download':
      return (
        <>
          <Path d="M12 4v11M8 11.5 12 15.5l4-4" {...p} />
          <Path d="M4.5 17.5v1.2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.2" {...p} />
        </>
      );
    case 'share':
      return (
        <>
          <Circle cx={17.5} cy={6} r={2.6} {...p} />
          <Circle cx={6.5} cy={12} r={2.6} {...p} />
          <Circle cx={17.5} cy={18} r={2.6} {...p} />
          <Path d="m8.9 10.7 6.2-3.4M8.9 13.3l6.2 3.4" {...p} />
        </>
      );
    case 'more':
      return (
        <>
          <Circle cx={5.5} cy={12} r={1.7} fill={c} />
          <Circle cx={12} cy={12} r={1.7} fill={c} />
          <Circle cx={18.5} cy={12} r={1.7} fill={c} />
        </>
      );
    case 'refresh':
      return (
        <>
          <Path d="M20 12a8 8 0 1 1-2.6-5.9" {...p} />
          <Path d="M20 4v4.5h-4.5" {...p} />
        </>
      );
    case 'star2':
      return <Path d="m12 4 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z" {...p} fill={fill} />;
    case 'cloud':
      return (
        <>
          <Path d="M7 18.5h10.2a3.8 3.8 0 0 0 .4-7.6 5.6 5.6 0 0 0-10.7-1.2A3.9 3.9 0 0 0 7 18.5z" {...p} fill={fill} />
        </>
      );
    case 'database':
      return (
        <>
          <Path d="M4.5 6.5c0-1.4 3.4-2.5 7.5-2.5s7.5 1.1 7.5 2.5-3.4 2.5-7.5 2.5-7.5-1.1-7.5-2.5z" {...p} fill={fill} />
          <Path d="M4.5 6.5v11c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-11" {...p} />
          <Path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" {...p} />
        </>
      );
    case 'info':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...p} fill={fill} />
          <Path d="M12 11v5.5M12 7.8h.01" {...p} />
        </>
      );
    default:
      return <Circle cx={12} cy={12} r={8.5} {...p} fill={fill} />;
  }
}

export const ICON_SIZE = { sm: 16, md: 20, lg: 24, xl: 32 } as const;

export function iconFor(name: IconName, size = ICON_SIZE.md, color?: string) {
  return <Icon name={name} size={size} color={color} />;
}
