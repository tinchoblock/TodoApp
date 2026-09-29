# T08 - Drag reorder (persisted + broadcast)

## Goal
Manual draggable order, persisted and synced.

## Steps
1. `TodoList.tsx` / `TodoItem.tsx`: `draggable`, `onDragStart` stores id, `onDragOver` preventDefault + indicator, `onDrop` reorders local array `0..n-1`.
2. Local optimistic reorder + `reorderTodos([{id, sortOrder}])` (PUT /reorder).
3. On failure -> refetch to revert.
4. Backend already emits `reordered` (T04), T07 client applies it. Verify drop in A moves in B.
5. Simple recalc: `ordered.map((t,i)=>({id:t.id, sortOrder:i}))`. No complex gaps in v1.

## Acceptance criteria
- [x] Dragging changes visual order.
- [x] Order persists after reload.
- [x] Other tab sees new order without reload.

## Validate
Drag in A, verify B and reload.

## Next
T09-e2e-validation.
