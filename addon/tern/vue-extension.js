import tern from 'tern'
import infer from 'tern/lib/infer'

const preLoadDef = function(data) {
  if (data['!name'] == 'browser') {
    // Override Document#getElementById !type
    var getElementById = data['Document']['prototype']['getElementById']
    getElementById['!type'] = 'fn(id: string) -> !custom:Browser_getElementById'
    getElementById['!data'] = {'!lint': 'Browser_validateElementId'}
    // Override Document#createElement !type
    var createElement = data['Document']['prototype']['createElement']
    createElement['!type'] = 'fn(tagName: string) -> !custom:Browser_createElement'
    // Add Element#querySelector !effects
    var querySelector = data['Element']['prototype']['querySelector']
    querySelector['!effects'] = ['custom Browser_querySelector 0']
    querySelector['!data'] = {'!lint': 'Browser_validateCSSSelectors'}
    // Add Element#querySelector !effects
    var querySelectorAll = data['Element']['prototype']['querySelectorAll']
    querySelectorAll['!effects'] = ['custom Browser_querySelector 0']
    querySelectorAll['!data'] = {'!lint': 'Browser_validateCSSSelectors'}
    // Add Document#addEventListener/removeListener !effects
    eventType(data['addEventListener'])
    eventType(data['removeEventListener'])
    eventType(data['Node']['prototype']['addEventListener'])
    eventType(data['Node']['prototype']['removeEventListener'])
    eventType(data['Event']['prototype']['initEvent'])
  }
}

tern.registerPlugin('vue-extension', function (server, options) {
  server._browserExtension = {
    scriptTags: ['script'],
    resolveFiles:  true,
    fileExists: true
  }

  return {
    passes: {
      preLoadDef: preLoadDef,
      preParse: preParse,
      typeAt: findTypeAt,
      completion: findCompletions
    }
  }
})