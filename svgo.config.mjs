// Explicit conservative allowlist: dimensions, geometry, IDs, styles and titles survive.
export default {
  multipass: true,
  plugins: ["removeComments", "removeMetadata", "cleanupAttrs", "sortAttrs"],
};
