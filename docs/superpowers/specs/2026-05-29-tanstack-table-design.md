# TanStack Table Demo — Design

## Goal

Add a TanStack Table v8 demo section to the React Demos page for interview prep. Showcases all five core features — sorting, global filtering, pagination, column visibility, row selection — working together in one interactive exhibit.

## Approach

Single self-contained component `TanStackTableSection` dropped into `ReactDemosPage`, matching the existing `VirtualizationSection` and `CompoundComponentsSection` pattern. Hard-coded sample data, no API, no store. All TanStack Table state managed locally with `useState`.

## Tech Stack

- `@tanstack/react-table` v8 (`useReactTable` hook, CSF row models)
- React `useState` for table state (sorting, filtering, pagination, column visibility, row selection)
- Existing shared components: `Input`, `Button`, `Badge`
- Tailwind 4 for styling

## File Structure

```
src/features/react-demos/components/
  TanStackTableSection.tsx          ← new: self-contained demo
  __stories__/
    TanStackTableSection.stories.tsx ← new: Default story
```

**Modified:**
- `src/features/react-demos/components/ReactDemosPage.tsx` — add `<TanStackTableSection />`
- `package.json` — add `@tanstack/react-table`

## Sample Data

20 hard-coded employee rows. Columns:

| Column     | Type   | Notes                               |
|------------|--------|-------------------------------------|
| name       | string | First + last name                   |
| role       | string | `admin` / `editor` / `viewer`       |
| department | string | `Engineering` / `Design` / `Product` / `Marketing` |
| status     | string | `active` / `inactive`               |
| salary     | number | Displayed as `$NNNk`                |

20 rows ensures 4 pages at 5 rows/page without feeling contrived.

## Features

### Sorting
- `getSortedRowModel()` enabled on all columns
- Click header → asc → desc → unsorted (cycle)
- Arrow indicator in header: `↑` asc, `↓` desc, `↕` unsorted
- Only one column sorted at a time (multi-sort out of scope)

### Global Filter
- `getFilteredRowModel()` + `globalFilterFn: 'includesString'`
- Single `Input` above the table — searches all columns simultaneously
- Resets pagination to page 0 when filter changes

### Pagination
- `getPaginationRowModel()`, 5 rows per page (`pageSize: 5`)
- Controls: `[Prev]` / `[Next]` buttons (disabled at boundaries)
- Label: `Page N of M — total rows`

### Column Visibility
- `columnVisibility` state, one checkbox per column
- Rendered as a row of checkboxes above the table
- All columns visible by default

### Row Selection
- First column is a checkbox column (not sortable, not filterable)
- Header checkbox: select-all / deselect-all for current page rows
- Bottom-left label: `N selected` (hidden when 0)

## UI Layout

```
[Search: _______________]   [☑ Name ☑ Role ☑ Dept ☑ Status ☑ Salary]

[ ☐ | Name ↑   | Role   | Department  | Status   | Salary  ]
[ ☐ | Alice B. | Admin  | Engineering | ● Active | $120k   ]
[ ☐ | Bob S.   | Editor | Design      | ● Active | $95k    ]
...5 rows...

[3 selected]          [Page 1 of 4 — 20 employees]  [← Prev]  [Next →]
```

Status column uses `Badge` component (`success` for active, `error` for inactive).

## Testing

One test file: `src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx`

Tests:
- Renders section heading
- Shows 5 rows by default (first page)
- Clicking a column header sorts rows (name asc → Alice before Bob)
- Typing in search input filters rows
- Next/Prev buttons paginate
- Column visibility checkbox hides/shows column
- Selecting a row updates the selected count label

## Storybook

`TanStackTableSection.stories.tsx` — single `Default` story, no args needed (all state internal).

## Out of Scope

- Server-side sorting / filtering / pagination
- Column resizing or pinning
- Multi-column sort
- Row grouping / expanding
- Virtual scrolling (separate VirtualizationSection already covers this)
