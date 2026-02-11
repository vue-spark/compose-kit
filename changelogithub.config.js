export default {
  tagFilter: (tag) => !tag.startsWith('runtime@'),
  types: {
    feat: { title: '🚀 Features' },
    fix: { title: '🐞 Bug Fixes' },
    perf: { title: '🏎 Performance' },
    refactor: { title: '💅 Refactors' },
    chore: { title: '🏡 Chores' },
    docs: { title: '📖 Documentation' },
  },
}
