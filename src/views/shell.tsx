import { useCallback, useState } from 'react'
import type { Route } from '../nav'
import { Newsstand } from './newsstand'
import { Issue } from './issue'
import { Article } from './article'

/**
 * The signed-in shell: one route in state, handed to each view as `go`. No
 * router dependency — the three editorial views (newsstand → issue → article)
 * are pure functions of the current route.
 */
export function Shell() {
  const [route, setRoute] = useState<Route>({ at: 'newsstand' })
  const go = useCallback((next: Route) => {
    setRoute(next)
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  if (route.at === 'issue') return <Issue issue={route.issue} go={go} />
  if (route.at === 'article') return <Article issue={route.issue} article={route.article} go={go} />
  return <Newsstand go={go} />
}
