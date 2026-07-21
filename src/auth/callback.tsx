import { useEffect, useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner, Text } from '@hanzo/gui'
import { Kicker, Action, ink, paper, red, mute } from '../press'

/**
 * The PKCE return leg. hanzo.id redirects here with `?code=&state=`; the SDK
 * exchanges the code for tokens, then we land on the newsstand. On failure we
 * show the error and a way back rather than a blank spinner.
 */
export function Callback() {
  const { handleCallback } = useIam()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleCallback()
      .then(() => window.location.replace('/'))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Sign-in failed'))
  }, [handleCallback])

  return (
    <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" gap={16} backgroundColor={paper}>
      {error ? (
        <>
          <Kicker>Sign-in failed</Kicker>
          <Text color={red} fontSize={15}>{error}</Text>
          <Action label="Back to the cover" onPress={() => window.location.replace('/')} variant="line" />
        </>
      ) : (
        <>
          <Spinner size="large" color={red} />
          <Text color={mute} fontSize={14} fontWeight="700" letterSpacing={2} textTransform="uppercase">Going to press…</Text>
          <Text color={ink} fontSize={12} opacity={0.5}>Completing sign-in</Text>
        </>
      )}
    </YStack>
  )
}
