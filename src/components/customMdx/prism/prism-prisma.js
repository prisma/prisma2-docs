import Prism from 'prism-react-renderer/prism'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
Prism.languages.prisma = Prism.languages.extend('clike', {
  keyword: /\b(?:datasource|enum|generator|model|type)\b/,
  'type-class-name': /(\b()\s+)[\w.\\]+/,
})

Prism.languages.javascript['class-name'][0].pattern =
  /(\b(?:model|datasource|enum|generator|type)\s+)[\w.\\]+/

Prism.languages.insertBefore('prisma', 'function', {
  annotation: {
    pattern: /(^|[^.])@+\w+/,
    lookbehind: true,
    alias: 'punctuation',
  },
})

Prism.languages.insertBefore('prisma', 'punctuation', {
  'type-args': /\b(?:references|fields):/,
})

Prism.languages.json5 = Prism.languages.js
