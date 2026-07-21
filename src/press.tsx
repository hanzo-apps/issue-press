import type { ComponentProps, ReactNode } from 'react'
import { XStack, YStack, H4, Text, Input, TextArea } from '@hanzo/gui'

/**
 * Press — the magazine's design language, in ONE place.
 *
 * A print-derived palette (black ink, white paper, one hot red) and the small
 * set of editorial primitives every view composes from: the masthead bar, the
 * kicker, rules, action blocks, selectable chips, and the two form fields. UI is
 * 100% @hanzo/gui primitives (XStack/YStack/Text/Input) — no second kit.
 */

export const ink = '#0b0b0b'
export const inkSoft = '#26221e'
export const paper = '#ffffff'
export const news = '#f5f2ea'
export const red = '#e10600'
export const redDark = '#b60500'
export const mute = '#726c64'
export const line = '#e5e0d5'

/** The colophon wordmark — a red block + the masthead name, always on ink. */
export function Mark({ onPress }: { onPress?: () => void }) {
  return (
    <XStack alignItems="center" gap={11} onPress={onPress} cursor={onPress ? 'pointer' : 'default'}>
      <YStack width={16} height={16} backgroundColor={red} />
      <H4 fontSize={22} fontWeight="900" letterSpacing={6} textTransform="uppercase" color={paper}>
        Press
      </H4>
    </XStack>
  )
}

/** The persistent black masthead bar with a red baseline rule. */
export function Masthead({ right, onHome }: { right?: ReactNode; onHome?: () => void }) {
  return (
    <XStack
      backgroundColor={ink}
      paddingHorizontal={24}
      paddingVertical={15}
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={3}
      borderColor={red}
      flexWrap="wrap"
      gap={12}
    >
      <Mark onPress={onHome} />
      <XStack alignItems="center" gap={10} flexWrap="wrap">
        {right}
      </XStack>
    </XStack>
  )
}

/** Uppercase, letter-spaced label — the department/standfirst kicker. */
export function Kicker({ children, color = red }: { children: ReactNode; color?: string }) {
  return (
    <Text color={color} fontSize={12} fontWeight="800" letterSpacing={3} textTransform="uppercase">
      {children}
    </Text>
  )
}

/** A print rule. Ink by default; pass red for the hot baseline. */
export function Rule({ color = ink, height = 2 }: { color?: string; height?: number }) {
  return <YStack width="100%" height={height} backgroundColor={color} />
}

/** A pressable editorial block — the one button in the system. */
export function Action({
  label,
  onPress,
  variant = 'solid',
  on = 'light',
  disabled = false,
}: {
  label: string
  onPress: () => void
  variant?: 'solid' | 'line'
  on?: 'light' | 'dark'
  disabled?: boolean
}) {
  const solid = variant === 'solid'
  const fg = solid ? paper : on === 'dark' ? paper : ink
  return (
    <XStack
      onPress={disabled ? undefined : onPress}
      cursor={disabled ? 'default' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      backgroundColor={solid ? red : 'transparent'}
      borderWidth={solid ? 0 : 2}
      borderColor={on === 'dark' ? paper : ink}
      paddingHorizontal={18}
      paddingVertical={10}
      alignItems="center"
      justifyContent="center"
      hoverStyle={solid ? { backgroundColor: redDark } : { borderColor: red }}
    >
      <Text color={fg} fontSize={12} fontWeight="800" letterSpacing={2} textTransform="uppercase">
        {label}
      </Text>
    </XStack>
  )
}

/** A selectable chip — departments, and the draft/cover toggles. */
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <XStack
      onPress={onPress}
      cursor="pointer"
      backgroundColor={active ? ink : 'transparent'}
      borderWidth={1}
      borderColor={active ? ink : line}
      paddingHorizontal={14}
      paddingVertical={8}
      hoverStyle={{ borderColor: ink }}
    >
      <Text color={active ? paper : mute} fontSize={12} fontWeight="700" letterSpacing={1} textTransform="uppercase">
        {label}
      </Text>
    </XStack>
  )
}

/** A labelled form row. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <YStack gap={7}>
      <Text color={mute} fontSize={11} fontWeight="800" letterSpacing={2} textTransform="uppercase">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

/** Sharp-edged single-line input, editorial styling baked in. */
export function Line(props: ComponentProps<typeof Input>) {
  return (
    <Input
      backgroundColor={paper}
      borderWidth={1}
      borderColor={line}
      borderRadius={0}
      color={ink}
      height={46}
      paddingHorizontal={13}
      fontSize={15}
      {...props}
    />
  )
}

/** Sharp-edged multi-line body input. */
export function Body(props: ComponentProps<typeof TextArea>) {
  return (
    <TextArea
      backgroundColor={paper}
      borderWidth={1}
      borderColor={line}
      borderRadius={0}
      color={ink}
      paddingHorizontal={13}
      paddingVertical={11}
      fontSize={15}
      rows={7}
      {...props}
    />
  )
}

/** Deterministic date stamp for cover lines and bylines. */
export function stamp(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
}
