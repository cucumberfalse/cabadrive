# Russian Translation Shards

Source of truth: `content/translations/ru/*.json`.

Each worker edits only the assigned ticket range:

- `001-092.json`
- `093-184.json`
- `185-276.json`
- `277-368.json`
- `369-460.json`

After editing a shard, regenerate the compatibility index with:

```sh
node scripts/content-shards.mjs --write-indexes
```

`content/translations/ru.translations.json` is a generated compatibility index, not the source of truth.
