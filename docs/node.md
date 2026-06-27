# Node.js: Event Loop, Streams, Buffers, and Workers

Node.js extends JavaScript with non-blocking I/O, streams, binary buffers, and multi-core patterns. Production services rely on async I/O, incremental processing, and careful separation of CPU-bound work from the event loop.

---

## Introduction

Node's **event loop** (via libuv) schedules timers, I/O callbacks, and microtasks similarly to browsers, but file system and DNS operations use a **thread pool**. **Streams** enable constant-memory processing of large files. **Buffers** represent binary data. **worker_threads** offload CPU-heavy work; **cluster** (legacy pattern) forks processes for multi-core HTTP — often replaced by container replication today.

---

## When to Use

| Feature            | Use when                                                           |
| ------------------ | ------------------------------------------------------------------ |
| **Streams**        | Logs, CSV, uploads, HTTP proxying                                  |
| **Buffers**        | Crypto, binary protocols, file headers                             |
| **worker_threads** | Compression, image resize, heavy JSON parse                        |
| **fs/promises**    | Async file access on request path                                  |
| **cluster**        | Legacy multi-process binding to port (evaluate alternatives first) |

---

## When to Avoid

- `readFileSync` / `writeFileSync` on HTTP hot paths
- Loading multi-GB files entirely into memory
- worker_threads for trivial tasks — serialization overhead dominates
- cluster when Kubernetes/PM2 horizontal scaling suffices
- Default `utf8` assumption for all binary data

---

## Best Practices

1. Validate `process.env` once at startup into a config object
2. Use `node:fs/promises` or streams — not sync fs in servers
3. Handle `error` events on all streams
4. Set explicit `highWaterMark` when tuning backpressure
5. Terminate workers on timeout; avoid orphaned threads

---

## Bad Practices

- Unhandled `error` on Readable streams — crashes process
- Buffer concatenation in loop (`buf = Buffer.concat([buf, chunk])`) — quadratic copy
- Sharing mutable state between workers without synchronization
- Ignoring backpressure (`write` return false) in custom streams

---

## Streams

### ❌ Bad

```javascript
import fs from 'node:fs/promises';

const data = await fs.readFile('access.log'); // 2GB into memory
for (const line of data.toString().split('\n')) processLine(line);
```

---

### ✅ Better

```javascript
import { createReadStream } from 'node:fs';

const stream = createReadStream('access.log', { encoding: 'utf8' });
stream.on('data', (chunk) => processChunk(chunk));
stream.on('error', (err) => logger.error(err));
```

Chunk processing — handle line boundaries across chunks.

---

### ✅ Best

```javascript
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLogFile(path) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    await processLine(line);
  }
}
```

Line-by-line async iteration; constant memory regardless of file size.

---

## Buffers

### ❌ Bad

```javascript
const hash = crypto.createHash('sha256').update(fs.readFileSync('file.bin')).digest('hex');
```

Sync read blocks event loop.

---

### ✅ Better

```javascript
const hash = crypto.createHash('sha256');
const stream = createReadStream('file.bin');
for await (const chunk of stream) hash.update(chunk);
const digest = hash.digest('hex');
```

---

### ✅ Best

```javascript
import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';

async function sha256File(path) {
  const hash = createHash('sha256');
  await pipeline(createReadStream(path), async function* (source) {
    for await (const chunk of source) hash.update(chunk);
    yield hash.digest('hex');
  });
}
```

Use `pipeline` for proper error propagation and cleanup.

---

## Worker Threads

### ❌ Bad

```javascript
// JSON.parse 50MB on main thread during HTTP request
const data = JSON.parse(await fs.readFile('huge.json', 'utf8'));
```

---

### ✅ Better

```javascript
import { Worker } from 'node:worker_threads';

function parseInWorker(jsonPath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./parse-worker.js', import.meta.url), {
      workerData: { jsonPath },
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

---

### ✅ Best

```javascript
import { Worker } from 'node:worker_threads';

export function runWorkerTask(workerUrl, workerData, { timeoutMs = 30_000 } = {}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl, { workerData });
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Worker timeout'));
    }, timeoutMs);

    worker.on('message', (result) => {
      clearTimeout(timer);
      resolve(result);
    });
    worker.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    worker.on('exit', (code) => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`Worker exit ${code}`));
    });
  });
}
```

Timeout and cleanup prevent hung workers. **Trade-off:** data copy cost — pass file paths or SharedArrayBuffer when appropriate.

---

## Cluster (When Still Relevant)

### ❌ Bad

Single Node process on 32-core machine handling CPU-bound JS on main thread.

### ✅ Best

Prefer **horizontal scaling** (multiple containers behind load balancer). Use cluster only when single-host multi-process is required:

```javascript
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
} else {
  await import('./server.js');
}
```

Document why containers are insufficient if choosing cluster.

---

## Before / After

### 103. Callback fs

**Before:** nested `fs.readFile` callbacks  
**After:** `import fs from 'node:fs/promises'`

### 104. process.env

**Before:** `process.env.DB_URL` scattered  
**After:** `config` module validated at boot

### 105. Error-first callback

**Before:** manual `(err, data) =>`  
**After:** promisified API or `fs/promises`

---

## Common Pitfalls

- **Event loop blocked** — sync crypto, large sync fs, JSON.parse megabytes
- **Uncaught stream errors** — always attach `error` handler or use `pipeline`
- **\_\_dirname in ESM** — use `import.meta.url`
- **Dual CJS/ESM** — duplicate module instances

---

## Performance

- Thread pool default size (4) limits parallel sync fs — use async APIs
- Buffer pool reuse in hot paths — advanced; profile first
- worker_threads startup ~ms — amortize over substantial CPU work

---

## References

- [Node.js — Event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node.js — Stream](https://nodejs.org/api/stream.html)
- [Node.js — Buffer](https://nodejs.org/api/buffer.html)
- [Node.js — Worker threads](https://nodejs.org/api/worker_threads.html)
- [Node.js — Cluster](https://nodejs.org/api/cluster.html)
