// #26 — chunk array helper

export function chunkBefore(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk = [];
    for (let j = i; j < i + size && j < arr.length; j++) chunk.push(arr[j]);
    result.push(chunk);
  }
  return result;
}

export function chunkAfter(arr, size) {
  return arr.reduce((chunks, item, index) => {
    if (index % size === 0) chunks.push([]);
    chunks[chunks.length - 1].push(item);
    return chunks;
  }, []);
}
