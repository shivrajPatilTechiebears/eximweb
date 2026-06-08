"use client";
import { useCallback } from "react";

/**
 * Attach to a form container div via `onKeyDown`.
 * When the user presses Enter inside any <input> or <select> it moves focus
 * to the next focusable field — exactly like Tab.
 *
 * Elements with `tabIndex={-1}` or `disabled` are skipped automatically.
 *
 * @example
 * <div onKeyDown={handleEnterMoveNext}>
 *   <Input ... />
 *   <Select ... />
 * </div>
 */
export function handleEnterMoveNext(e: React.KeyboardEvent): void {
  if (e.key !== "Enter") return;
  const el = e.target as HTMLElement;
  if (el.tagName !== "INPUT" && el.tagName !== "SELECT") return;
  e.preventDefault();

  const container = e.currentTarget as HTMLElement;
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'input:not([tabindex="-1"]):not([disabled]), select:not([tabindex="-1"]):not([disabled])'
    )
  );
  const idx = focusable.indexOf(el);
  if (idx >= 0 && idx < focusable.length - 1) focusable[idx + 1].focus();
}

/**
 * Returns a memoized `onKeyDown` handler to attach to a div wrapping a table.
 *
 * Behaviour:
 * - **Enter** on a table `<input>` or `<select>` → focus the same column in
 *   the **next row**.
 * - **Enter on the last row** → calls `onLastRow()` (e.g. add a new row),
 *   then focuses the first input of the newly inserted row after React
 *   re-renders.
 * - **Tab** is left to the browser's default behaviour (no override).
 * - Buttons with `tabIndex={-1}` are skipped automatically on Tab.
 *
 * @param onLastRow  Optional callback invoked when Enter is pressed on the
 *                   last data row (typically `addItem` / `addSchedule`).
 *
 * @example
 * const handleItemsEnter = useTableEnterHandler(addItem);
 *
 * <div onKeyDown={handleItemsEnter}>
 *   <DataTable ... />
 * </div>
 */
export function useTableEnterHandler(onLastRow?: () => void) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const el = e.target as HTMLElement;
      if (el.tagName !== "INPUT" && el.tagName !== "SELECT") return;
      e.preventDefault();

      const td = el.closest("td") as HTMLTableCellElement | null;
      const tr = td?.closest("tr") as HTMLTableRowElement | null;
      if (!td || !tr) return;

      const nextTr = tr.nextElementSibling as HTMLTableRowElement | null;

      if (nextTr) {
        const colIdx = Array.from(tr.cells).indexOf(td);
        (nextTr.cells[colIdx]?.querySelector<HTMLElement>("input, select"))?.focus();
      } else if (onLastRow) {
        onLastRow();
        // Wait one tick for React to append the new row, then focus its first input
        setTimeout(() => {
          const tbody   = tr.closest("tbody");
          const lastRow = tbody?.lastElementChild as HTMLTableRowElement | null;
          (lastRow?.querySelector<HTMLElement>("input, select"))?.focus();
        }, 30);
      }
    },
    [onLastRow]
  );
}
