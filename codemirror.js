import CodeMirror from 'codemirror'
import {debounce} from 'lodash'

import './mode/vue/vue'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'

import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/indent-fold'

import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/css-hint'


import 'imports-loader?tern=tern!./addon/tern/tern';
import ecma from './addon/tern/defs/ecma5'
import browser from './addon/tern/defs/browser'

import 'codemirror-colorpicker'

import emmet from '@emmetio/codemirror-plugin';

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/tern/tern.css'
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'

emmet(CodeMirror);

export default {
  name: 'codemirror',

  model: {
    event: 'change'
  },

  props: {
    value: String,
  },

  watch: {
    value(newValue) {
      if (this.editor) {
        if (newValue !== this.editor.doc.getValue()) {
          this.editor.getDoc().setValue(newValue || '');
        }
      }
    }
  },

  methods: {
    init() {
      this.editor = CodeMirror(this.$el, {
        value: this.value || '',
        tabSize: 2,
        mode: 'text/x-vue',
        htmlMode: 'html',
        lineNumbers: true,
        line: true,
        autoCloseBrackets: true,
        autoCloseTags: {
          whenOpening: true,
          indentTags: ["template", "script", "style", "applet", "blockquote", "body", "button", "div", "dl", "fieldset", "form", "frameset", "h1", "h2", "h3", "h4",
            "h5", "h6", "head", "html", "iframe", "layer", "legend", "object", "ol", "select", "table", "ul"]
        },
        matchBrackets: true,
        foldGutter: true,
        lint: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        colorpicker : true,
        extraKeys: {
          'Tab': 'emmetExpandAbbreviation',
          'Enter': 'emmetInsertLineBreak'
        }
      });

      const ExcludedIntelliSenseTriggerKeys = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "107": "add",
        "109": "subtract",
        "110": "decimal point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock",
        "186": "semicolon",
        "187": "equalsign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "slash",
        "192": "graveaccent",
        "220": "backslash",
        "222": "quote"
      }

      const ternServer = new CodeMirror.TernServer({
        useWorker: true,
        workerScript: '/public/dist/codemirror-tern.worker.build.js',
        defs: [browser, ecma],
        plugins: {"browser-extension" : {}}
      })
      this.editor.on("keyup", function(editor, event) {
        const curosr = editor.getDoc().getCursor();
        const token = editor.getTokenAt(curosr);
        if(
          !editor.state.completionActive &&
          !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()] &&
          !!token.type
        ) {
          if(!!token.state.localMode && token.state.localMode.helperType === 'javascript') {
            ternServer.complete(editor)
          } else {
            CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
          }
        }
      })

      this.editor.on("change", debounce(function(editor) {
        const value = editor.doc.getValue()
        if (this.value !== value) {
          this.$emit('change', value)
        }
      }.bind(this), 100))

      this.editor.on("focus", (e) => {
        this.$emit('focus', e)
      })
    }
  },

  mounted() {
    this.init()
  },

  beforeDestroy() {
    this.editor.toTextArea()
  },

  render(h) {
    return h('div')
  }
}