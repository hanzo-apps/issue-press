import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { XStack, YStack, H1, H2, H3, Paragraph, Text, Spinner } from '@hanzo/gui'
import type { Go, Issue as IssueRow, Article } from '../nav'
import { departments } from '../nav'
import { Masthead, Kicker, Rule, Action, Chip, Field, Line, Body, ink, paper, news, red, mute, line, stamp } from '../press'

/**
 * Issue contents — the cover story up top, then department sections. Editors
 * file new pieces into the issue here; a click opens a piece to read. Articles
 * are the org-scoped `articles` collection filtered to this issue.
 */
export function Issue({ issue, go }: { issue: string; go: Go }) {
  const { logout } = useIam()
  const { data: issues } = useQuery<IssueRow>('issues', { realtime: false })
  const { data: articles, isLoading, error, refetch } = useQuery<Article>('articles', {
    filter: `issue_id = "${issue}"`,
    sort: 'order',
    realtime: false,
  })
  const create = useMutation('articles', 'create')
  const remove = useMutation('articles', 'delete')

  const rec = issues.find((i) => i.id === issue)
  const cover = articles.find((a) => Boolean(a.is_cover)) ?? articles[0]
  const rest = articles.filter((a) => a.id !== cover?.id)
  const groups = new Map<string, Article[]>()
  for (const a of rest) {
    const key = a.department || 'Unfiled'
    groups.set(key, [...(groups.get(key) ?? []), a])
  }

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dek, setDek] = useState('')
  const [dept, setDept] = useState<string>(departments[0])
  const [text, setText] = useState('')
  const [isCover, setIsCover] = useState(false)

  async function file() {
    const t = title.trim()
    if (!t || create.isLoading) return
    await create.mutate({
      issue_id: issue,
      title: t,
      dek: dek.trim(),
      body: text.trim(),
      department: dept,
      is_cover: isCover,
      order: articles.length,
    })
    setTitle(''); setDek(''); setText(''); setIsCover(false); setOpen(false)
    await refetch()
  }

  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={paper}>
      <Masthead
        onHome={() => go({ at: 'newsstand' })}
        right={
          <>
            <Action label={open ? 'Close' : 'File a piece'} onPress={() => setOpen((o) => !o)} on="dark" variant="line" />
            <Action label="Sign out" onPress={() => logout()} on="dark" variant="line" />
          </>
        }
      />

      <YStack width="100%" maxWidth={1160} alignSelf="center" paddingHorizontal={28} paddingVertical={28} gap={22}>
        <Text onPress={() => go({ at: 'newsstand' })} cursor="pointer" color={mute} fontSize={13} fontWeight="800" letterSpacing={1} textTransform="uppercase" hoverStyle={{ color: ink }}>
          ← The newsstand
        </Text>

        {!rec ? (
          <XStack gap={10} alignItems="center" paddingVertical={40}>
            <Spinner color={red} /> <Text color={mute}>Opening the issue…</Text>
          </XStack>
        ) : (
          <>
            {/* Issue head */}
            <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={16}>
              <YStack gap={12} flex={1} minWidth={280}>
                <XStack gap={12} alignItems="center" flexWrap="wrap">
                  <Kicker>Issue {String(rec.number).padStart(2, '0')}</Kicker>
                  {rec.published ? (
                    <XStack backgroundColor={red} paddingHorizontal={9} paddingVertical={3}>
                      <Text color={paper} fontSize={10} fontWeight="900" letterSpacing={1} textTransform="uppercase">Live · {stamp(rec.published_at)}</Text>
                    </XStack>
                  ) : (
                    <XStack borderWidth={1} borderColor={mute} paddingHorizontal={9} paddingVertical={2}>
                      <Text color={mute} fontSize={10} fontWeight="800" letterSpacing={1} textTransform="uppercase">Draft</Text>
                    </XStack>
                  )}
                </XStack>
                <H1 fontSize={72} lineHeight={68} fontWeight="900" letterSpacing={-2} color={ink}>{rec.title}</H1>
                {rec.cover_line ? <Paragraph fontSize={20} lineHeight={29} color={mute} maxWidth={720}>{rec.cover_line}</Paragraph> : null}
              </YStack>
              <YStack overflow="hidden" backgroundColor={ink} paddingHorizontal={20} paddingVertical={16} minWidth={132} alignItems="center">
                <Text color={red} fontSize={12} fontWeight="900" letterSpacing={4} textTransform="uppercase">No.</Text>
                <H1 fontSize={80} lineHeight={76} fontWeight="900" letterSpacing={-3} color={paper}>{String(rec.number).padStart(2, '0')}</H1>
              </YStack>
            </XStack>
            <Rule color={red} height={3} />

            {open ? (
              <YStack backgroundColor={news} borderWidth={1} borderColor={line} padding={22} gap={16}>
                <Kicker>File a piece into issue {rec.number}</Kicker>
                <Field label="Headline">
                  <Line value={title} onChangeText={setTitle} placeholder="A headline with confidence" />
                </Field>
                <Field label="Dek / standfirst">
                  <Line value={dek} onChangeText={setDek} placeholder="The line under the headline that sets it up." />
                </Field>
                <Field label="Department">
                  <XStack gap={9} flexWrap="wrap">
                    {departments.map((d) => (
                      <Chip key={d} label={d} active={dept === d} onPress={() => setDept(d)} />
                    ))}
                  </XStack>
                </Field>
                <Field label="Body">
                  <Body value={text} onChangeText={setText} placeholder={'Write the piece. Separate paragraphs with a blank line.\n\nThe reader sees it set in two columns with a pulled quote.'} />
                </Field>
                <XStack gap={10} alignItems="center" flexWrap="wrap">
                  <Text color={mute} fontSize={11} fontWeight="800" letterSpacing={2} textTransform="uppercase">Placement</Text>
                  <Chip label="Cover story" active={isCover} onPress={() => setIsCover((v) => !v)} />
                  <Text color={mute} fontSize={13}>{isCover ? 'Runs as the cover.' : 'Runs in its department.'}</Text>
                </XStack>
                {create.error ? <Paragraph color={red} fontSize={14}>{create.error.message}</Paragraph> : null}
                <XStack>
                  <Action label={create.isLoading ? 'Filing…' : 'File the piece'} onPress={file} disabled={create.isLoading || !title.trim()} />
                </XStack>
              </YStack>
            ) : null}

            {isLoading ? (
              <XStack gap={10} alignItems="center" paddingVertical={40}>
                <Spinner color={red} /> <Text color={mute}>Setting the issue…</Text>
              </XStack>
            ) : error ? (
              <Paragraph color={red} fontSize={15}>Couldn’t reach Base ({error.message}).</Paragraph>
            ) : articles.length === 0 ? (
              <YStack alignItems="center" gap={12} paddingVertical={48}>
                <H2 fontSize={28} fontWeight="800" color={ink}>No pieces filed yet.</H2>
                <Paragraph color={mute} fontSize={16} textAlign="center" maxWidth={440}>File the cover story and a few department pieces to set this issue.</Paragraph>
                <Action label="File the cover story" onPress={() => { setIsCover(true); setOpen(true) }} />
              </YStack>
            ) : (
              <YStack gap={30}>
                {/* Cover story */}
                {cover ? (
                  <YStack backgroundColor={ink} overflow="hidden" padding={28} gap={14} onPress={() => go({ at: 'article', issue, article: cover.id })} cursor="pointer" hoverStyle={{ backgroundColor: inkHover }}>
                    <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
                      <Kicker>Cover story · {cover.department || 'Features'}</Kicker>
                      <Text color={mute} fontSize={12} fontWeight="700" letterSpacing={1} textTransform="uppercase">Read →</Text>
                    </XStack>
                    <H1 fontSize={56} lineHeight={54} fontWeight="900" letterSpacing={-1} color={paper}>{cover.title}</H1>
                    {cover.dek ? <Paragraph fontSize={19} lineHeight={28} color="#d9d4cc" maxWidth={820}>{cover.dek}</Paragraph> : null}
                  </YStack>
                ) : null}

                {/* Department sections */}
                {[...groups.entries()].map(([name, list]) => (
                  <YStack key={name} gap={4}>
                    <XStack alignItems="center" gap={12}>
                      <H3 fontSize={16} fontWeight="900" letterSpacing={2} textTransform="uppercase" color={red}>{name}</H3>
                      <YStack flex={1} height={2} backgroundColor={ink} />
                    </XStack>
                    {list.map((a) => (
                      <XStack key={a.id} justifyContent="space-between" alignItems="center" gap={16} borderBottomWidth={1} borderColor={line} paddingVertical={16} onPress={() => go({ at: 'article', issue, article: a.id })} cursor="pointer" hoverStyle={{ backgroundColor: news }}>
                        <XStack gap={18} alignItems="baseline" flex={1}>
                          <Text color={red} fontSize={22} fontWeight="900" letterSpacing={-1}>{String((a.order ?? 0) + 1).padStart(2, '0')}</Text>
                          <YStack flex={1} gap={4}>
                            <H3 fontSize={23} lineHeight={26} fontWeight="800" color={ink}>{a.title}</H3>
                            {a.dek ? <Paragraph fontSize={15} lineHeight={21} color={mute} numberOfLines={2}>{a.dek}</Paragraph> : null}
                          </YStack>
                        </XStack>
                        <Text onPress={() => del(a.id)} cursor="pointer" color={mute} fontSize={11} fontWeight="700" letterSpacing={1} textTransform="uppercase" hoverStyle={{ color: red }}>Delete</Text>
                      </XStack>
                    ))}
                  </YStack>
                ))}
              </YStack>
            )}
          </>
        )}
      </YStack>
    </YStack>
  )
}

const inkHover = '#1a1714'
