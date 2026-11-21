import type React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string
          alt?: string
          poster?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'shadow-intensity'?: string | number
          loading?: 'auto' | 'lazy' | 'eager'
        },
        HTMLElement
      >
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string
          alt?: string
          poster?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'shadow-intensity'?: string | number
          loading?: 'auto' | 'lazy' | 'eager'
        },
        HTMLElement
      >
    }
  }
}

export {}
