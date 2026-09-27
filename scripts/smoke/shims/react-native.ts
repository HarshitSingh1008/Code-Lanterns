/** Minimal `react-native` stand-in so non-UI modules bundle under plain Node. */
export const Platform = {
  OS: 'node' as const,
  select: <T,>(spec: { node?: T; default?: T }) => spec.node ?? spec.default,
};
