// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
  "use strict";
  if (typeof exports === "object" && typeof module === "object") {// CommonJS
    mod(require("codemirror/lib/codemirror"),
        require("codemirror/addon/mode/overlay"),
        require("codemirror/mode/xml/xml"),
        require("codemirror/mode/javascript/javascript"),
        require("codemirror/mode/coffeescript/coffeescript"),
        require("codemirror/mode/css/css"),
        require("codemirror/mode/sass/sass"),
        require("codemirror/mode/stylus/stylus"),
        require("codemirror/mode/pug/pug"),
        require("codemirror/mode/handlebars/handlebars"));
  } else if (typeof define === "function" && define.amd) { // AMD
    define(["codemirror/lib/codemirror",
            "codemirrorcodemirror/mode/addon/mode/overlay",
            "codemirror/mode/xml/xml",
            "codemirror/mode/javascript/javascript",
            "codemirror/mode/coffeescript/coffeescript",
            "codemirror/mode/css/css",
            "codemirror/mode/sass/sass",
            "codemirror/mode/stylus/stylus",
            "codemirror/mode/pug/pug",
            "codemirror/mode/handlebars/handlebars"], mod);
  } else { // Plain browser env
    mod(CodeMirror);
  }
})(function (CodeMirror) {
  var tagLanguages = {
    script: [
      ["lang", /coffee(script)?/, "coffeescript"],
      ["type", /^(?:text|application)\/(?:x-)?coffee(?:script)?$/, "coffeescript"],
      ["lang", /^babel$/, "javascript"],
      ["type", /^text\/babel$/, "javascript"],
      ["type", /^text\/ecmascript-\d+$/, "javascript"]
    ],
    style: [
      ["lang", /^stylus$/i, "stylus"],
      ["lang", /^sass$/i, "sass"],
      ["lang", /^less$/i, "text/x-less"],
      ["lang", /^scss$/i, "text/x-scss"],
      ["type", /^(text\/)?(x-)?styl(us)?$/i, "stylus"],
      ["type", /^text\/sass/i, "sass"],
      ["type", /^(text\/)?(x-)?scss$/i, "text/x-scss"],
      ["type", /^(text\/)?(x-)?less$/i, "text/x-less"]
    ],
  };

  CodeMirror.defineMode("vue-template", function (config, parserConfig) {
    var mustacheOverlay = {
      token: function (stream) {
        if (stream.match(/^\{\{.*?\}\}/)) return "meta mustache";
        while (stream.next() && !stream.match("{{", false)) {}
        return null;
      }
    };
    return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mustacheOverlay);
  });

  CodeMirror.defineMode("vue", function (config) {
    return CodeMirror.getMode(config, {name: "htmlmixed", tags: tagLanguages});
  }, "htmlmixed", "xml", "javascript", "coffeescript", "css", "sass", "stylus", "pug", "handlebars");

  CodeMirror.defineMIME("script/x-vue", "vue");
  CodeMirror.defineMIME("text/x-vue", "vue");
});
