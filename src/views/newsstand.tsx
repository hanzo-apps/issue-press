import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { XStack, YStack, H1, H2, H3, Paragraph, Text, Spinner } from '@hanzo/gui'
import type { Go, Issue } from '../nav'
import { Masthead, Kicker, Rule, Action, Chip, Field, Line, ink, paper, news, red, mute, line, stamp } from '../press'

/**
 * The newsstand — every issue as a cover, newest first. Editors compose a new
 * numbered issue here; a click opens its contents. Reads/writes the org-scoped
 * `issues` collection through the IAM-token'd Base client.
 */
export function Newsstand({ go }: { go: Go }) {
  const { logout } = useIam()
  const { data, isLoading, error, refetch } = useQuery<Issue>('issues', { sort: '-number', realtime: false })
  const create = useMutation('issues', 'create')
  const update = useMutation('issues', 'update')
  const remove = useMutation('issues', 'delete')

  const nextNumber = (data.reduce((m, i) => Math.max(m, Number(i.number) || 0), 0) || 0) + 1
  const [open, setOpen] = useState(false)
  const [num, setNum] = useState('')
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState('')
  const [pub, setPub] = useState(false)

  async function add() {
    const t = title.trim()
    if (!t || create.isLoading) return
    const parsed = parseInt(num, 10)
    await create.mutate({
      number: Number.isNaN(parsed) ? nextNumber : parsed,
      title: t,
      cover_line: cover.trim(),
      published: pub,
      published_at: pub ? new Date().toISOString() : '',
    })
    setNum(''); setTitle(''); setCover(''); setPub(false); setOpen(false)
    await refetch()
  }

  async function togglePublish(i: Issue) {
    const next = !i.published
    await update.mutate({ id: i.id, published: next, published_at: next ? new Date().toISOString() : '' })
    await refetch()
  }

  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={paper}>
      <Masthead
        right={
          <>
            <Action label={open ? 'Close' : 'New issue'} onPress={() => setOpen((o) => !o)} on="dark" variant="line" />
            <Action label="Sign out" onPress={() => logout()} on="dark" variant="line" />
          </>
        }
      />

      <YStack width="100%" maxWidth={1240} alignSelf="center" paddingHorizontal={28} paddingVertical={30} gap={24}>
        <XStack justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={12}>
          <YStack gap={6}>
            <Kicker>The newsstand</Kicker>
            <H1 fontSize={54} lineHeight={52} fontWeight="900" letterSpacing={-1} color={ink}>Every issue.</H1>
          </YStack>
          <Text color={mute} fontSize={14} fontWeight="700" letterSpacing={1} textTransform="uppercase">
            {data.length} {data.length === 1 ? 'issue' : 'issues'} on the shelf
          </Text>
        </XStack>
        <Rule color={red} height={3} />

        {open ? (
          <YStack backgroundColor={news} borderWidth={1} borderColor={line} padding={22} gap={16}>
            <Kicker>Compose an issue</Kicker>
            <XStack gap={16} flexWrap="wrap">
              <YStack width={120}>
                <Field label="Issue no.">
                  <Line value={num} onChangeText={setNum} placeholder={String(nextNumber)} keyboardType="number-pad" />
                </Field>
              </YStack>
              <YStack flex={1} minWidth={240}>
                <Field label="Title">
                  <Line value={title} onChangeText={setTitle} placeholder="The Inaugural Issue" onSubmitEditing={add} />
                </Field>
              </YStack>
            </XStack>
            <Field label="Cover line">
              <Line value={cover} onChangeText={setCover} placeholder="A single line that sells the whole issue." onSubmitEditing={add} />
            </Field>
            <XStack gap={10} alignItems="center" flexWrap="wrap">
              <Text color={mute} fontSize={11} fontWeight="800" letterSpacing={2} textTransform="uppercase">Status</Text>
              <Chip label="Draft" active={!pub} onPress={() => setPub(false)} />
              <Chip label="Publish now" active={pub} onPress={() => setPub(true)} />
            </XStack>
            {create.error ? <Paragraph color={red} fontSize={14}>{create.error.message}</Paragraph> : null}
            <XStack gap={10}>
              <Action label={create.isLoading ? 'Placing…' : 'Place on the shelf'} onPress={add} disabled={create.isLoading || !title.trim()} />
            </XStack>
          </YStack>
        ) : null}

        {isLoading ? (
          <XStack gap={10} alignItems="center" paddingVertical={40}>
            <Spinner color={red} /> <Text color={mute}>Loading the newsstand…</Text>
          </XStack>
        ) : error ? (
          <Paragraph color={red} fontSize={15}>
            Couldn’t reach Base ({error.message}). Confirm VITE_HANZO_BASE_URL and that you’re signed in.
          </Paragraph>
        ) : data.length === 0 ? (
          <YStack alignItems="center" gap={12} paddingVertical={56}>
            <H2 fontSize={30} fontWeight="800" color={ink}>The shelf is empty.</H2>
            <Paragraph color={mute} fontSize={16} textAlign="center" maxWidth={440}>
              Compose issue no. {nextNumber} to open the magazine. Give it a title, a cover line, and its first pieces.
            </Paragraph>
            <Action label="Compose the first issue" onPress={() => setOpen(true)} />
          </YStack>
        ) : (
          <XStack flexWrap="wrap" gap={22}>
            {data.map((i) => (
              <YStack key={i.id} flexBasis={340} flexGrow={1} minWidth={280} maxWidth={560} borderWidth={1} borderColor={line} backgroundColor={paper}>
                <YStack onPress={() => go({ at: 'issue', issue: i.id })} cursor="pointer" hoverStyle={{ borderColor: red }}>
                  <YStack backgroundColor={ink} overflow="hidden" paddingHorizontal={20} paddingTop={16} paddingBottom={14} gap={4}>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Kicker>Issue</Kicker>
                      {i.published ? (
                        <XStack backgroundColor={red} paddingHorizontal={9} paddingVertical={4}>
                          <Text color={paper} fontSize={10} fontWeight="900" letterSpacing={1} textTransform="uppercase">Live</Text>
                        </XStack>
                      ) : (
                        <XStack borderWidth={1} borderColor={mute} paddingHorizontal={9} paddingVertical={3}>
                          <Text color={paper} fontSize={10} fontWeight="800" letterSpacing={1} textTransform="uppercase">Draft</Text>
                        </XStack>
                      )}
                    </XStack>
                    <H1 fontSize={88} lineHeight={84} fontWeight="900" letterSpacing={-3} color={paper}>
                      {String(i.number).padStart(2, '0')}
                    </H1>
                  </YStack>
                  <YStack padding={18} gap={9} minHeight={128}>
                    <H3 fontSize={21} lineHeight={24} fontWeight="800" color={ink}>{i.title}</H3>
                    <Paragraph fontSize={14} lineHeight={20} color={mute} numberOfLines={3}>{i.cover_line}</Paragraph>
                  </YStack>
                </YStack>
                <XStack justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor={line} paddingHorizontal={18} paddingVertical={11}>
                  <Text onPress={() => go({ at: 'issue', issue: i.id })} cursor="pointer" color={red} fontSize={13} fontWeight="800" letterSpacing={1} textTransform="uppercase">
                    Open issue →
                  </Text>
                  <XStack gap={14} alignItems="center">
                    {i.published_at ? <Text color={mute} fontSize={12}>{stamp(i.published_at)}</Text> : null}
                    <Text onPress={() => togglePublish(i)} cursor="pointer" color={mute} fontSize={12} fontWeight="700" letterSpacing={1} textTransform="uppercase" hoverStyle={{ color: ink }}>
                      {i.published ? 'Unpublish' : 'Publish'}
                    </Text>
                    <Text onPress={() => del(i.id)} cursor="pointer" color={mute} fontSize={12} fontWeight="700" letterSpacing={1} textTransform="uppercase" hoverStyle={{ color: red }}>
                      Delete
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            ))}
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}
