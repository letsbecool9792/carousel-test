/**
 * Simple module-level bridge to let CardDetailScreen scroll the HomeScreen
 * carousel BEFORE dismissing — avoiding the 1-frame flicker where the old
 * card is visible.
 *
 * HomeScreen registers its scrollTo callback on mount.
 * CardDetailScreen calls scrollToHome(index) right before goBack().
 */

let scrollCallback: ((index: number) => void) | null = null;

/** HomeScreen calls this on mount to register its carousel's scrollTo. */
export function registerScrollCallback(cb: (index: number) => void): void {
  scrollCallback = cb;
}

/** HomeScreen calls this on unmount. */
export function unregisterScrollCallback(): void {
  scrollCallback = null;
}

/**
 * Scroll the home carousel to `index` immediately.
 * Called by CardDetailScreen before goBack().
 */
export function scrollToHome(index: number): void {
  scrollCallback?.(index);
}
