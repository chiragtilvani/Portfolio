import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
  /** optional: called once when an error is caught */
  onError?: (error: Error) => void
}

interface State {
  failed: boolean
}

/**
 * Catches render/runtime errors from a subtree (used around WebGL canvases)
 * and swaps in a fallback instead of unmounting the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error)
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
