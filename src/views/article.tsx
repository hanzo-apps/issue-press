import { useIam } from '@hanzo/iam/react'
import { useQuery } from '@hanzo/base/react'
import { XStack, YStack, H1, H2, Paragraph, Text, Spinner } from '@hanzo/gui'
import type { Go, Issue as IssueRow, Article as ArticleRow } from '../nav'
import { Masthead, Kicker, Rule, Action, ink, inkSoft, paper, red, mute } from '../press'

/** The longest sentence, pulled and capped — a deterministic pull-quote. */
function pull(body: string): string | null {
  const parts = body.replace(/\s+/g, ' ').split(/(?<=[.!?])\s/).map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return null
  const best = parts.reduce((a, b) => (b.length > a.length ? b : a))
  return best.length > 170 ? `${best.slice(0, 167).trim()}…` : best
}

/** Paragraphs, split on blank lines (or single newlines). */
function paras(body: string): string[] {
  return body.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean)
}

/**
 * Article read — the feature layout: kicker, oversized headline, standfirst, a
 * hanging pull-quote, and the body set in two columns. The piece and its issue
 * are read from the org-scoped Base collections.
 */
export function Article({ issue, article, go }: { issue: string; article: string; go: Go }) {
  const { logout } = useIam()
  const { data: issues } = useQuery<IssueRow>('issues', { realtime: false })
  const { data: articles, isLoading, error } = useQuery<ArticleRow>('articles', {
    filter: `issue_id = "${issue}"`,
    realtime: false,
  })

  const rec = articles.find((a) => a.id === article)
  const issueRec = issues.find((i) => i.id === issue)
  const body = rec?.body ?? ''
  const blocks = paras(body)
  const mid = Math.ceil(blocks.length / 2)
  const colA = blocks.slice(0, mid)
  const colB = blocks.slice(mid)
  const quote = pull(body)

  const backToIssue = () => go({ at: 'issue', issue })

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={paper}>
      <Masthead
        onHome={() => go({ at: 'newsstand' })}
        right={
          <>
            <Action label="Back to issue" onPress={backToIssue} on="dark" variant="line" />
            <Action label="Sign out" onPress={() => logout()} on="dark" variant="line" />
          </>
        }
      />

      <YStack width="100%" maxWidth={1080} alignSelf="center" paddingHorizontal={28} paddingVertical={30} gap={20}>
        <Text onPress={backToIssue} cursor="pointer" color={mute} fontSize={13} fontWeight="800" letterSpacing={1} textTransform="uppercase" hoverStyle={{ color: ink }}>
          ← {issueRec ? `Issue ${String(issueRec.number).padStart(2, '0')} · ${issueRec.title}` : 'Back to issue'}
        </Text>

        {isLoading ? (
          <XStack gap={10} alignItems="center" paddingVertical={40}>
            <Spinner color={red} /> <Text color={mute}>Turning to the page…</Text>
          </XStack>
        ) : error ? (
          <Paragraph color={red} fontSize={15}>Couldn’t reach Base ({error.message}).</Paragraph>
        ) : !rec ? (
          <YStack alignItems="center" gap={12} paddingVertical={48}>
            <H2 fontSize={28} fontWeight="800" color={ink}>This piece isn’t in the issue.</H2>
            <Action label="Back to the issue" onPress={backToIssue} />
          </YStack>
        ) : (
          <>
            {/* Feature head */}
            <YStack gap={18} maxWidth={880} alignSelf="center" width="100%">
              <XStack gap={12} alignItems="center" flexWrap="wrap">
                {rec.is_cover ? (
                  <XStack backgroundColor={red} paddingHorizontal={9} paddingVertical={4}>
                    <Text color={paper} fontSize={10} fontWeight="900" letterSpacing={1} textTransform="uppercase">Cover story</Text>
                  </XStack>
                ) : null}
                <Kicker>{rec.department || 'Features'}{issueRec ? ` · Issue ${String(issueRec.number).padStart(2, '0')}` : ''}</Kicker>
              </XStack>
              <H1 fontSize={68} lineHeight={64} fontWeight="900" letterSpacing={-2} color={ink}>{rec.title}</H1>
              {rec.dek ? <Paragraph fontSize={23} lineHeight={32} color={inkSoft} fontStyle="italic">{rec.dek}</Paragraph> : null}
              <Rule color={ink} height={2} />
            </YStack>

            {/* Hanging pull-quote */}
            {quote ? (
              <YStack maxWidth={820} alignSelf="center" width="100%" gap={12} paddingVertical={12}>
                <YStack width={64} height={4} backgroundColor={red} />
                <H2 fontSize={34} lineHeight={40} fontWeight="800" fontStyle="italic" color={ink}>“{quote}”</H2>
              </YStack>
            ) : null}

            {/* Two-column body */}
            {blocks.length === 0 ? (
              <Paragraph fontSize={17} lineHeight={27} color={mute} maxWidth={820} alignSelf="center" width="100%">
                This piece has no body yet. Open the issue and file the copy.
              </Paragraph>
            ) : (
              <XStack gap={40} flexWrap="wrap" maxWidth={880} alignSelf="center" width="100%">
                <YStack flex={1} minWidth={280} gap={16}>
                  {colA.map((p, n) => (
                    <Paragraph key={`a-${n}`} fontSize={17} lineHeight={27} color={inkSoft}>{p}</Paragraph>
                  ))}
                </YStack>
                <YStack flex={1} minWidth={280} gap={16}>
                  {colB.map((p, n) => (
                    <Paragraph key={`b-${n}`} fontSize={17} lineHeight={27} color={inkSoft}>{p}</Paragraph>
                  ))}
                </YStack>
              </XStack>
            )}

            <YStack maxWidth={880} alignSelf="center" width="100%" paddingTop={10} gap={16}>
              <Rule color={red} height={3} />
              <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
                <Text color={mute} fontSize={13} fontWeight="700" letterSpacing={1} textTransform="uppercase">
                  End of piece{issueRec ? ` · Issue ${String(issueRec.number).padStart(2, '0')}` : ''}
                </Text>
                <Action label="Back to the issue" onPress={backToIssue} variant="line" />
              </XStack>
            </YStack>
          </>
        )}
      </YStack>
    </YStack>
  )
}
