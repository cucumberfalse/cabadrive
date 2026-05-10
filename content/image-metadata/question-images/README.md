# Question Image Metadata Shards

Source of truth: `content/image-metadata/question-images/*.json`.

Each worker edits only the assigned ticket range:

- `001-092.json`
- `093-184.json`
- `185-276.json`
- `277-368.json`
- `369-460.json`

`questionUsages` belong to the shard for their `questionId`. `images` are owned by the lowest-numbered image-backed question that uses the image, so shared images have one metadata owner and multiple per-question usages. The current shared image is `b2.jpg`, owned with `b-fallback-256` while `b-fallback-303` keeps only its usage mapping.

After editing a shard, regenerate the compatibility index with:

```sh
node scripts/content-shards.mjs --write-indexes
```

`content/image-metadata/question-images.manifest.json` is a generated compatibility index, not the source of truth.
