# Stage 1

## Approach and System Design

### 1. Problem Statement
The objective is to fetch an ongoing stream of notifications from a provided API and efficiently maintain the top `n` (specifically 10) most important *unread* notifications. 
Priority is determined by:
1. **Type Weight**: Placement > Result > Event
2. **Recency**: Newer notifications have higher priority than older ones of the same type.

### 2. Data Structure Selection
To maintain the top `n` items efficiently as new data streams in, appending and sorting the entire list every time a new notification arrives would be inefficient (`O(N log N)` where `N` is the total number of notifications). 

Instead, a **Min-Heap (Priority Queue)** of size `n` is the optimal data structure.
- **Why Min-Heap?** A Min-Heap keeps the *smallest* (lowest priority) element at its root. 
- When a new notification arrives, we simply compare it to the root of the heap.
- If the new notification has a *higher* priority than the root, we remove the root and insert the new notification. 
- If the heap has less than `n` items, we simply insert it.

### 3. Priority Logic Implementation
In Python, tuples are compared element by element. We structure our heap items as a tuple:
`(type_weight, timestamp, notification_id, notification_data)`

- `type_weight`: Integer mapping (`Placement`: 3, `Result`: 2, `Event`: 1).
- `timestamp`: The formatted timestamp string (e.g., "2026-04-22 17:51:30"). Because it goes from Year down to Seconds, chronological string sorting directly matches date sorting perfectly.
- `notification_id`: Acts as a unique tie-breaker so the application doesn't attempt to compare the dictionary if weights and timestamps are identical.
- `notification_data`: The actual payload to display.

Because we use a Min-Heap, the notification with the lowest `type_weight` and oldest `timestamp` naturally drops to the root of the heap, making it an `O(1)` operation to identify which notification to evict when the 11th item arrives.

### 4. Complexity Analysis
- **Time Complexity:** 
  - Processing each incoming notification: `O(log n)` where `n` is the size of the heap (10). 
  - For `K` incoming notifications, the total time complexity is `O(K log n)`. Since `n` is a constant 10, processing an item effectively takes `O(1)` time per notification.
- **Space Complexity:** 
  - `O(n)` to store the top `n` elements in memory. Since `n = 10`, the memory footprint is exceptionally small, strict, and constant `O(1)`. This prevents memory bloat regardless of how many thousands of notifications arrive.

### 5. Production Readiness
In a real-world production environment with persistent streaming data (e.g., WebSockets or Server-Sent Events):
- This heap logic can be kept in-memory (e.g., in a Redis Sorted Set or application state) for ultra-fast, real-time access.
- When a user clicks/reads a notification, it is removed from the heap, and we can back-fill the next highest priority item via a localized database index.
