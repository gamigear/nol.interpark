/**
 * Merge class names, filtering out falsy values.
 *
 * A minimal alternative to `clsx`/`classnames` — used across shared
 * section shells, wrappers, and public components for conditional className
 * composition without adding a dependency.
 */
export function cn(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
