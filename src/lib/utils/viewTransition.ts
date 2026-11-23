/** True when the browser supports same-document View Transitions (Chrome, Edge, Safari 18+, Firefox 144+). */
export const supportsViewTransitions = (): boolean => typeof document !== 'undefined' && 'startViewTransition' in document;
