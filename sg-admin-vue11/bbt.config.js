// https://github.com/wakeadmin/bbt-tools/blob/main/docs/config.md

module.exports = {
  langs: ['zh', 'en', 'pt', 'th', 'vi', 'ko'],
  src: './src/locales/lang/',
  test: '.*\\.json$',
  exclude: ['node_modules'],
  outFileExtName: 'json',
};
