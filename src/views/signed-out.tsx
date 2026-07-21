import { useIam } from '@hanzo/iam/react'
import { XStack, YStack, H1, H2, H3, Paragraph, Text } from '@hanzo/gui'
import { Masthead, Kicker, Rule, Action, ink, inkSoft, paper, news, red, mute, stamp } from '../press'
import { departments } from '../nav'

/**
 * The cover — the signed-out landing and the honest public thumbnail. A real
 * magazine cover: masthead bar, oversized cover line, and a bold cover block.
 * The one action is PKCE sign-in with Hanzo (hanzo.id); everything past it is
 * org-scoped in Base.
 */
export function SignedOut() {
  const { login, isLoading } = useIam()
  const enter = () => login()

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={paper}>
      <Masthead
        right={<Action label={isLoading ? 'Loading…' : 'Sign in'} on="dark" variant="line" onPress={enter} disabled={isLoading} />}
      />

      <YStack width="100%" maxWidth={1240} alignSelf="center" paddingHorizontal={28} paddingVertical={30} gap={22}>
        {/* Cover meta line */}
        <XStack justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={8}>
          <Kicker>Issue 01 · Inaugural</Kicker>
          <Kicker color={mute}>{stamp(new Date().toISOString())}</Kicker>
        </XStack>
        <Rule color={red} height={3} />

        {/* Hero: cover line + cover block */}
        <XStack gap={34} flexWrap="wrap" alignItems="stretch">
          <YStack flex={3} minWidth={340} gap={22} justifyContent="center" paddingVertical={12}>
            <Kicker>The magazine that ships in issues</Kicker>
            <H1 fontSize={82} lineHeight={78} fontWeight="900" letterSpacing={-2} color={ink}>
              The stories worth the whole issue.
            </H1>
            <Paragraph fontSize={19} lineHeight={29} color={inkSoft} maxWidth={620}>
              Press is an issue-based digital magazine. Editors curate numbered issues — a
              cover story and department sections across features, dispatch, interview and
              essay. Readers open an issue and move between its pieces.
            </Paragraph>
            <XStack gap={12} flexWrap="wrap" alignItems="center">
              <Action label={isLoading ? 'Loading…' : 'Enter the newsstand'} onPress={enter} disabled={isLoading} />
              <Text color={mute} fontSize={14}>Sign in with Hanzo — no local password.</Text>
            </XStack>
          </YStack>

          {/* The cover block — a composed cover, no stock imagery */}
          <YStack flex={2} minWidth={300} minHeight={460} backgroundColor={ink} overflow="hidden" justifyContent="space-between" padding={26}>
            <XStack justifyContent="space-between" alignItems="flex-start">
              <YStack backgroundColor={red} paddingHorizontal={11} paddingVertical={6}>
                <Text color={paper} fontSize={12} fontWeight="900" letterSpacing={2} textTransform="uppercase">Vol. I</Text>
              </YStack>
              <Text color={paper} fontSize={12} fontWeight="700" letterSpacing={2} textTransform="uppercase">Free preview</Text>
            </XStack>

            <YStack>
              <Text color={red} fontSize={16} fontWeight="900" letterSpacing={8} textTransform="uppercase">Issue</Text>
              <H1 fontSize={168} lineHeight={150} fontWeight="900" letterSpacing={-6} color={paper}>01</H1>
            </YStack>

            <YStack gap={8}>
              <Rule color={red} height={2} />
              <Kicker>Cover story</Kicker>
              <H2 fontSize={30} lineHeight={32} fontWeight="800" color={paper}>
                A magazine that ships in issues.
              </H2>
            </YStack>
          </YStack>
        </XStack>

        {/* Departments strip */}
        <YStack gap={12} paddingTop={6}>
          <Rule color={ink} />
          <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={16}>
            <Text color={ink} fontSize={13} fontWeight="800" letterSpacing={2} textTransform="uppercase">
              In this issue
            </Text>
            <XStack gap={14} flexWrap="wrap">
              {departments.map((d) => (
                <Text key={d} color={mute} fontSize={13} fontWeight="700" letterSpacing={1} textTransform="uppercase">
                  {d}
                </Text>
              ))}
            </XStack>
          </XStack>
        </YStack>

        {/* Colophon: what powers it */}
        <XStack gap={20} flexWrap="wrap" paddingTop={4}>
          {[
            ['Curated in issues', 'Numbered issues with a cover story and department sections.'],
            ['@hanzo/gui', 'Editorial UI from the Hanzo design system — no second kit.'],
            ['Org-scoped in Base', 'Every issue and article persists per-org, IAM-native.'],
          ].map(([t, b]) => (
            <YStack key={t} flex={1} minWidth={240} gap={7} backgroundColor={news} borderTopWidth={2} borderColor={red} padding={16}>
              <H3 fontSize={17} fontWeight="800" color={ink}>{t}</H3>
              <Paragraph fontSize={14} lineHeight={21} color={mute}>{b}</Paragraph>
            </YStack>
          ))}
        </XStack>
      </YStack>
    </YStack>
  )
}
