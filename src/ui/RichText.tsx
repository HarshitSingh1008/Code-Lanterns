import { Fragment } from 'react';
import { View } from 'react-native';

import { parseLines, parseSpans, type Span } from '@/lib/rich';
import { useTheme } from '@/theme/ThemeProvider';
import { SPACING } from '@/theme/tokens';
import { Icon } from './Icon';
import { Row } from './Surface';
import { Txt, toneColor, type TxtProps } from './Txt';

/**
 * Renders the small Markdown subset the local orchestrator emits: `**bold**`
 * inline, `•` bullet lines, and blank-line paragraph breaks. Everything else
 * is passed through as plain text.
 */
export function RichText({
  text,
  variant = 'body',
  tone,
}: {
  text: string;
  variant?: TxtProps['variant'];
  tone?: TxtProps['tone'];
}) {
  const { t } = useTheme();
  const bulletColor = tone ? toneColor(t, tone) : t.textFaint;
  const tight = variant === 'bodySm' || variant === 'caption';

  return (
    <View style={{ gap: SPACING.sm }}>
      {parseLines(text).map((lines, i) => (
        <View key={i}>
          {lines.map((line, j) => {
            const body = <Spans spans={parseSpans(line.text)} variant={variant} tone={tone} />;
            if (!line.bullet) return <Fragment key={j}>{body}</Fragment>;
            return (
              <Row key={j} gap={SPACING.sm} align="flex-start">
                <View style={{ paddingTop: tight ? 6 : 8 }}>
                  <Icon name="checkCircle" size={9} color={bulletColor} />
                </View>
                <View style={{ flex: 1 }}>{body}</View>
              </Row>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function Spans({
  spans,
  variant,
  tone,
}: {
  spans: Span[];
  variant?: TxtProps['variant'];
  tone?: TxtProps['tone'];
}) {
  return (
    <Txt variant={variant} tone={tone}>
      {spans.map((span, i) =>
        span.strong ? (
          <Txt key={i} variant={variant} tone={tone} strong>
            {span.text}
          </Txt>
        ) : (
          <Fragment key={i}>{span.text}</Fragment>
        )
      )}
    </Txt>
  );
}
