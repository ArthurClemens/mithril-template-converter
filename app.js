(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}Object.defineProperty(exports, "__esModule", { value: !0 });var _mithril = require("mithril"),
    _mithril2 = _interopRequireDefault(_mithril),
    _textfield = require("polythene/textfield/textfield"),
    _textfield2 = _interopRequireDefault(_textfield),
    _templateBuilder = require("app/converter/template-builder"),
    _templateBuilder2 = _interopRequireDefault(_templateBuilder);window.m = _mithril2.default;var converter = { controller: function controller() {
    this.source = _mithril2.default.prop(""), this.output = _mithril2.default.prop(""), this.convert = function () {
      return this.output((0, _templateBuilder2.default)(this.source()));
    }.bind(this);
  }, view: function view(ctrl) {
    var output = ctrl.output(),
        rendered = void 0;try {
      rendered = eval(output);
    } catch (e) {
      rendered = "Could not render Mithril code - please check the output for any errors.";
    }return (0, _mithril2.default)("div", [(0, _mithril2.default)("h2", "Paste source HTML"), _mithril2.default.component(_textfield2.default, { class: "source", autofocus: !0, getState: function getState(e) {
        var t = !(!ctrl.source() && !e.value);ctrl.source(e.value), "" === e.value ? ctrl.output("") : t && ctrl.convert();
      }, multiline: !0, rows: 8, value: ctrl.source() }), (0, _mithril2.default)("h2", "Copy Mithril code from here"), _mithril2.default.component(_textfield2.default, { class: "result", multiline: !0, rows: 8, value: function value() {
        return ctrl.output();
      } }), (0, _mithril2.default)("h2", "Rendered Mithril code"), (0, _mithril2.default)("div", { class: "render" }, rendered ? rendered : null)]);
  } };exports.default = converter;

},{"app/converter/template-builder":2,"mithril":5,"polythene/textfield/textfield":14}],2:[function(require,module,exports){
"use strict";
function each(t, a) {
  for (var e = 0; e < t.length; e++) {
    a(t[e], e);
  }
}function createFragment(e) {
  if (e.indexOf("<!doctype") >= 0) return [new DOMParser().parseFromString(e, "text/html").childNodes[1]];var t = document.createElement("div");return t.insertAdjacentHTML("beforeend", e), t.childNodes;
}function createVirtual(t) {
  var e = [];return each(t, function (t) {
    3 === t.nodeType ? e.push(t.nodeValue) : 1 === t.nodeType && !function () {
      var i = {};each(t.attributes, function (e) {
        i[e.name] = e.value;
      });var a = t.nodeName.toLowerCase(),
          r = svgCaseSensitiveTagNamesMap[a] ? svgCaseSensitiveTagNamesMap[a] : a;e.push({ tag: r, attrs: i, children: createVirtual(t.childNodes) });
    }();
  }), e;
}function TemplateBuilder(e, t) {
  this.virtual = e, this.level = t, this.virtuals = [];
}var svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"],
    svgCaseSensitiveTagNamesMap = {};svgCaseSensitiveTagNames.forEach(function (e) {
  svgCaseSensitiveTagNamesMap[e.toLowerCase()] = e;
}), TemplateBuilder.prototype = { addVirtualString: function addVirtualString(e) {
    this.virtuals.push('"' + e.replace(/(["\r\n])/g, "\\$1") + '"');
  }, addVirtualAttrs: function addVirtualAttrs(e) {
    var t = "div" === e.tag ? "" : e.tag;if (e.attrs.class && (t += "." + e.attrs.class.replace(/\s+/g, "."), e.attrs.class = void 0), each(Object.keys(e.attrs).sort(), function (i) {
      if ("style" !== i && void 0 !== e.attrs[i]) {
        t += "[" + i + "='";var a = e.attrs[i];a = a.replace(/[\n\r\t]/g, " "), a = a.replace(/\s+/g, " "), t += a.replace(/'/g, "\\'") + "']";
      }
    }), "" === t && (t = "div"), t = '"' + t + '"', e.attrs.style) {
      var a = e.attrs.style.replace(/(^.*);\s*$/, "$1"),
          i = a.replace(/[\n\r]/g, ""),
          r = i.split(/\s*;\s*/),
          n = r.map(function (e) {
        return e.split(/\s*:\s*/).map(function (e) {
          return '"' + e + '"';
        }).join(": ");
      }),
          s = n.join(", "),
          l = "{" + s + "}";t += ", {style: " + l + "}";
    }if (0 !== e.children.length) {
      var o = new TemplateBuilder(e.children, this.level + 1);t += ", " + o.complete();
    }this.virtuals.push("m(" + t + ")");
  }, complete: function complete() {
    if (each(this.virtual, function (e) {
      "string" == typeof e ? !/^\s*$/.test(e) && e.charCodeAt() >= 32 && this.addVirtualString(e) : this.addVirtualAttrs(e);
    }.bind(this)), 1 === this.virtuals.length && '"' === this.virtuals[0][0]) return this.virtuals.join(", ");var e = this.virtuals.join(",");return "[" + e + "]";
  } };var templateBuilder = function templateBuilder(e) {
  var t = createVirtual(createFragment(e));return new TemplateBuilder(t, 1).complete();
};"undefined" != typeof module && null !== module && module.exports ? module.exports = templateBuilder : "function" == typeof define && define.amd && define(function () {
  return templateBuilder;
});

},{}],3:[function(require,module,exports){
"use strict";

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _converter = require("app/converter/converter");

var _converter2 = _interopRequireDefault(_converter);

require("polythene/theme/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = {};
app.view = function () {
    return (0, _mithril2.default)("div", [(0, _mithril2.default)("h1", "Mithril HTML to JavaScript converter"), _mithril2.default.component(_converter2.default), (0, _mithril2.default)("div", {
        class: "footer"
    }, [(0, _mithril2.default)("span", "Built with "), (0, _mithril2.default)("a", {
        href: "https://github.com/ArthurClemens/Polythene"
    }, "Polythene"), (0, _mithril2.default)("span", " for "), (0, _mithril2.default)("a", {
        href: "https://github.com/lhorie/mithril.js"
    }, "Mithril"), (0, _mithril2.default)("span", ".")])]);
};

_mithril2.default.mount(document.body, app);

},{"app/converter/converter":1,"mithril":5,"polythene/theme/theme":19}],4:[function(require,module,exports){
'use strict';

var emptyObject = {};
var emptyArray = [];
var type = emptyObject.toString;
var own =  emptyObject.hasOwnProperty;
var OBJECT = type.call(emptyObject);
var ARRAY =  type.call(emptyArray);
var STRING = type.call('');
/*/-inline-/*/
// function cartesian(a, b, res, i, j) {
//   res = [];
//   for (j in b) if (own.call(b, j))
//     for (i in a) if (own.call(a, i))
//       res.push(a[i] + b[j]);
//   return res;
// }
/*/-inline-/*/

/* /-statements-/*/
function cartesian(a,b, selectorP, res, i, j) {
  res = []
  for (j in b) if(own.call(b, j))
    for (i in a) if(own.call(a, i))
      res.push(concat(a[i], b[j], selectorP))
  return res
}

function concat(a, b, selectorP) {
  // `b.replace(/&/g, a)` is never falsy, since the
  // 'a' of cartesian can't be the empty string
  // in selector mode.
  return selectorP && (
    /^[-\w$]+$/.test(b) && ':-error-bad-sub-selector-' + b ||
    /&/.test(b) && /* never falsy */ b.replace(/&/g, a)
  ) || a + b
}

function decamelize(match) {
  return '-' + match.toLowerCase()
}

/**
 * Handles the property:value; pairs.
 *
 * @param {array|object|string} o - the declarations.
 * @param {string[]} buf - the buffer in which the final style sheet is built.
 * @param {string} prefix - the current property or a prefix in case of nested
 *                          sub-properties.
 * @param {string} vendors - a list of vendor prefixes.
 * @Param {boolean} local - are we in @local or in @global scope.
 * @param {object} ns - helper functions to populate or create the @local namespace
 *                      and to @extend classes.
 * @param {function} ns.e - @extend helper.
 * @param {function} ns.l - @local helper.
 */

function declarations(o, buf, prefix, vendors, local, ns, /*var*/ k, v, kk) {
  if (o==null) return
  if (/\$/.test(prefix)) {
    for (kk in (prefix = prefix.split('$'))) if (own.call(prefix, kk)) {
      declarations(o, buf, prefix[kk], vendors, local, ns)
    }
    return
  }
  switch ( type.call(o = o.valueOf()) ) {
  case ARRAY:
    for (k = 0; k < o.length; k++)
      declarations(o[k], buf, prefix, vendors, local, ns)
    break
  case OBJECT:
    // prefix is falsy iif it is the empty string, which means we're at the root
    // of the declarations list.
    prefix = (prefix && prefix + '-')
    for (k in o) if (own.call(o, k)){
      v = o[k]
      if (/\$/.test(k)) {
        for (kk in (k = k.split('$'))) if (own.call(k, kk))
          declarations(v, buf, prefix + k[kk], vendors, local, ns)
      } else {
        declarations(v, buf, prefix + k, vendors, local, ns)
      }
    }
    break
  default:
    // prefix is falsy when it is "", which means that we're
    // at the top level.
    // `o` is then treated as a `property:value` pair.
    // otherwise, `prefix` is the property name, and
    // `o` is the value.
    k = prefix.replace(/_/g, '-').replace(/[A-Z]/g, decamelize)

    if (local && (k == 'animation-name' || k == 'animation')) {
      o = o.split(',').map(function (o) {
        return o.replace(/()(?::global\(\s*([-\w]+)\s*\)|()([-\w]+))/, ns.l)
      }).join(',')
    }
    if (/^animation|^transition/.test(k)) vendors = ['webkit']
    // '@' in properties also triggers the *ielte7 hack
    // Since plugins dispatch on the /^@/ for at-rules
    // we swap the at for an asterisk
    // http://browserhacks.com/#hack-6d49e92634f26ae6d6e46b3ebc10019a

    k = k.replace(/^@/, '*')

/*/-statements-/*/
    // vendorify
    for (kk = 0; kk < vendors.length; kk++)
      buf.push('-', vendors[kk], '-', k, k ? ':': '', o, ';\n')
/*/-statements-/*/

    buf.push(k, k ? ':': '', o, ';\n')

  }
}

var findClass = /()(?::global\(\s*(\.[-\w]+)\s*\)|(\.)([-\w]+))/g

/**
 * Hanldes at-rules
 *
 * @param {string} k - The at-rule name, and, if takes both parameters and a
 *                     block, the parameters.
 * @param {string[]} buf - the buffer in which the final style sheet is built
 * @param {string[]} v - Either parameters for block-less rules or their block
 *                       for the others.
 * @param {string} prefix - the current selector or a prefix in case of nested rules
 * @param {string} rawPrefix - as above, but without localization transformations
 * @param {string} vendors - a list of vendor prefixes
 * @Param {boolean} local - are we in @local or in @global scope?
 * @param {object} ns - helper functions to populate or create the @local namespace
 *                      and to @extend classes
 * @param {function} ns.e - @extend helper
 * @param {function} ns.l - @local helper
 */

function at(k, v, buf, prefix, rawPrefix, vendors, local, ns){
  var kk
  if (/^@(?:namespace|import|charset)$/.test(k)) {
    if(type.call(v) == ARRAY){
      for (kk = 0; kk < v.length; kk++) {
        buf.push(k, ' ', v[kk], ';\n')
      }
    } else {
      buf.push(k, ' ', v, ';\n')
    }
  } else if (/^@keyframes /.test(k)) {
    k = local ? k.replace(
      // generated by script/regexps.js
      /( )(?::global\(\s*([-\w]+)\s*\)|()([-\w]+))/,
      ns.l
    ) : k
    // add a @-webkit-keyframes block too.

    buf.push('@-webkit-', k.slice(1), ' {\n')
    sheet(v, buf, '', '', ['webkit'])
    buf.push('}\n')

    buf.push(k, ' {\n')
    sheet(v, buf, '', '', vendors, local, ns)
    buf.push('}\n')

  } else if (/^@extends?$/.test(k)) {

    /*eslint-disable no-cond-assign*/
    // pick the last class to be extended
    while (kk = findClass.exec(rawPrefix)) k = kk[4]
    /*eslint-enable no-cond-assign*/
    if (k == null || !local) {
      // we're in a @global{} block
      buf.push('@-error-cannot-extend-in-global-context ', JSON.stringify(rawPrefix), ';\n')
      return
    } else if (/^@extends?$/.test(k)) {
      // no class in the selector
      buf.push('@-error-no-class-to-extend-in ', JSON.stringify(rawPrefix), ';\n')
      return
    }
    ns.e(
      type.call(v) == ARRAY ? v.map(function (parent) {
        return parent.replace(/()(?::global\(\s*(\.[-\w]+)\s*\)|()\.([-\w]+))/, ns.l)
      }).join(' ') : v.replace(/()(?::global\(\s*(\.[-\w]+)\s*\)|()\.([-\w]+))/, ns.l),
      k
    )

  } else if (/^@(?:font-face$|viewport$|page )/.test(k)) {
    sheet(v, buf, k, k, emptyArray)

  } else if (/^@global$/.test(k)) {
    sheet(v, buf, prefix, rawPrefix, vendors, 0, ns)

  } else if (/^@local$/.test(k)) {
    sheet(v, buf, prefix, rawPrefix, vendors, 1, ns)

  } else if (/^@(?:media |supports |document )./.test(k)) {
    buf.push(k, ' {\n')
    sheet(v, buf, prefix, rawPrefix, vendors, local, ns)
    buf.push('}\n')

  } else {
    buf.push('@-error-unsupported-at-rule ', JSON.stringify(k), ';\n')
  }
}

/**
 * Add rulesets and other CSS statements to the sheet.
 *
 * @param {array|string|object} statements - a source object or sub-object.
 * @param {string[]} buf - the buffer in which the final style sheet is built
 * @param {string} prefix - the current selector or a prefix in case of nested rules
 * @param {string} rawPrefix - as above, but without localization transformations
 * @param {string} vendors - a list of vendor prefixes
 * @Param {boolean} local - are we in @local or in @global scope?
 * @param {object} ns - helper functions to populate or create the @local namespace
 *                      and to @extend classes
 * @param {function} ns.e - @extend helper
 * @param {function} ns.l - @local helper
 */
function sheet(statements, buf, prefix, rawPrefix, vendors, local, ns) {
  var k, kk, v, inDeclaration

  switch (type.call(statements)) {

  case ARRAY:
    for (k = 0; k < statements.length; k++)
      sheet(statements[k], buf, prefix, rawPrefix, vendors, local, ns)
    break

  case OBJECT:
    for (k in statements) {
      v = statements[k]
      if (prefix && /^[-\w$]+$/.test(k)) {
        if (!inDeclaration) {
          inDeclaration = 1
          buf.push(( prefix || '*' ), ' {\n')
        }
        declarations(v, buf, k, vendors, local, ns)
      } else if (/^@/.test(k)) {
        // Handle At-rules
        inDeclaration = (inDeclaration && buf.push('}\n') && 0)

        at(k, v, buf, prefix, rawPrefix, vendors, local, ns)

      } else {
        // selector or nested sub-selectors

        inDeclaration = (inDeclaration && buf.push('}\n') && 0)

        sheet(v, buf,
          (kk = /,/.test(prefix) || prefix && /,/.test(k)) ?
            cartesian(prefix.split(','), ( local ?
          k.replace(
            /()(?::global\(\s*(\.[-\w]+)\s*\)|(\.)([-\w]+))/g, ns.l
          ) : k
        ).split(','), prefix).join(',') :
            concat(prefix, ( local ?
          k.replace(
            /()(?::global\(\s*(\.[-\w]+)\s*\)|(\.)([-\w]+))/g, ns.l
          ) : k
        ), prefix),
          kk ?
            cartesian(rawPrefix.split(','), k.split(','), rawPrefix).join(',') :
            concat(rawPrefix, k, rawPrefix),
          vendors,
          local, ns
        )
      }
    }
    if (inDeclaration) buf.push('}\n')
    break
  case STRING:
    buf.push(
        ( prefix || ':-error-no-selector' ) , ' {\n'
      )
    declarations(statements, buf, '', vendors, local, ns)
    buf.push('}\n')
  }
}

var scope_root = '_j2c_' +
      Math.floor(Math.random() * 0x100000000).toString(36) + '_' +
      Math.floor(Math.random() * 0x100000000).toString(36) + '_' +
      Math.floor(Math.random() * 0x100000000).toString(36) + '_' +
      Math.floor(Math.random() * 0x100000000).toString(36) + '_';
var counter = 0;
function j2c(res) {
  res = res || {}
  var extensions = []

  function finalize(buf, i) {
    for (i = 0; i< extensions.length; i++) buf = extensions[i](buf) || buf
    return buf.join('')
  }

  res.use = function() {
    var args = arguments
    for (var i = 0; i < args.length; i++){
      extensions.push(args[i])
    }
    return res
  }
/*/-statements-/*/
  res.sheet = function(ns, statements) {
    if (arguments.length === 1) {
      statements = ns; ns = {}
    }
    var
      suffix = scope_root + counter++,
      locals = {},
      k, buf = []
    // pick only non-numeric keys since `(NaN != NaN) === true`
    for (k in ns) if (k-0 != k-0 && own.call(ns, k)) {
      locals[k] = ns[k]
    }
    sheet(
      statements, buf, '', '', emptyArray /*vendors*/,
      1, // local
      {
        e: function extend(parent, child) {
          var nameList = locals[child]
          locals[child] =
            nameList.slice(0, nameList.lastIndexOf(' ') + 1) +
            parent + ' ' +
            nameList.slice(nameList.lastIndexOf(' ') + 1)
        },
        l: function localize(match, space, global, dot, name) {
          if (global) {
            return space + global
          }
          if (!locals[name]) locals[name] = name + suffix
          return space + dot + locals[name].match(/\S+$/)
        }
      }
    )
    /*jshint -W053 */
    buf = new String(finalize(buf))
    /*jshint +W053 */
    for (k in locals) if (own.call(locals, k)) buf[k] = locals[k]
    return buf
  }
/*/-statements-/*/
  res.inline = function (locals, decl, buf) {
    if (arguments.length === 1) {
      decl = locals; locals = {}
    }
    declarations(
      decl,
      buf = [],
      '', // prefix
      emptyArray, // vendors
      1,
      {
        l: function localize(match, space, global, dot, name) {
          if (global) return space + global
          if (!locals[name]) return name
          return space + dot + locals[name]
        }
      })
    return finalize(buf)
  }

  res.prefix = function(val, vendors) {
    return cartesian(
      vendors.map(function(p){return '-' + p + '-'}).concat(['']),
      [val]
    )
  }
  return res
}

j2c.global = function(x) {
  return ':global(' + x + ')'
}

j2c.kv = kv
function kv (k, v, o) {
  o = {}
  o[k] = v
  return o
}

j2c.at = function at (rule, params, block) {
  if (
    arguments.length < 3
  ) {
    var _at = at.bind.apply(at, [null].concat([].slice.call(arguments,0)))
    _at.toString = function(){return '@' + rule + ' ' + params}
    return _at
  }
  else return kv('@' + rule + ' ' + params, block)
}

j2c(j2c)
delete j2c.use

module.exports = j2c;
},{}],5:[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function() {}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}

		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0]
		}
		else {
			cell.children = children
		}
		
		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					cell.attrs[attrName] = "" //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName]
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
		
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
					len = data.length
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			
			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
					}
					break
				}
			}
			
			if (shouldMaintainIdentities) {
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)
					newCached.nodes = cached.nodes.slice()

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
							newCached.nodes[change.index] = dummy
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			var views = [], controllers = []
			while (data.view) {
				var view = data.view.$original || data.view
				var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1
				var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)
				var key = data && data.attrs && data.attrs.key
				data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"}
				if (data.subtree === "retain") return cached;
				if (key) {
					if (!data.attrs) data.attrs = {}
					data.attrs.key = key
				}
				if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
				views.push(view)
				controllers.push(controller)
			}
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
				if (cached.controllers) {
					for (var i = 0, controller; controller = cached.controllers[i]; i++) {
						if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
					}
				}
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
					for (var i = 0, controller; controller = controllers[i]; i++) {
						if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
						if (pendingRequests && controller.onunload) {
							var onunload = controller.onunload
							controller.onunload = noop
							controller.onunload.$old = onunload
						}
					}
				}
				
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
				}
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			for (var i = 0, controller; controller = cached.controllers[i]; i++) {
				if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
			}
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this
		}
		var view = function(ctrl) {
			if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
			return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
		}
		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}
	m.component = function(component) {
		return parameterize(component, [].slice.call(arguments, 1))
	}
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		
		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};
		for (var i = 0, unloader; unloader = unloaders[i]; i++) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		}
		if (isPrevented) {
			for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
		}
		else unloaders = []
		
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			controllers[index].onunload(event)
		}
		
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
			var currentComponent = topComponent = component = component || {controller: function() {}};
			var constructor = component.controller || noop
			var controller = new constructor;
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	var redrawing = false
	m.redraw = function(force) {
		if (redrawing) return
		redrawing = true
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
		redrawing = false
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
				m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
					isDefaultRoute = true
					m.route(defaultRoute, true)
					isDefaultRoute = false
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePreRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			var vdom = arguments[3];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePreRedrawHook = setScroll
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.mount(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		if (str.charAt(0) === "?") str = str.substring(1);
		
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		}
		return params
	}
	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString
	
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _config=require("polythene/config/config");var _config2=_interopRequireDefault(_config);require("polythene/common/object.assign");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}var vendorize=function vendorize(what,prefixes){var vendorsSel=prefixes.map(function(v){return"_"+v+"$"}).join("");return _defineProperty({},vendorsSel,what)};var fit=function fit(){var offset=arguments.length<=0||arguments[0]===undefined?0:arguments[0];var offsetPx=offset+"px";return{position:"absolute",top:offsetPx,right:offsetPx,bottom:offsetPx,left:offsetPx}};var fontSmoothing=function fontSmoothing(){var smoothing=arguments.length<=0||arguments[0]===undefined?true:arguments[0];if(smoothing){return{"-webkit-font-smoothing":"antialiased","-moz-osx-font-smoothing":"grayscale"}}else{return{"-webkit-font-smoothing":"subpixel-antialiased","-moz-osx-font-smoothing":"auto"}}};var ellipsis=function ellipsis(lines,lineHeight){if(lines==="none"){return{"text-overflow":"initial",overflow:"initial","white-space":"initial",display:"block",height:"auto"}}return Object.assign({overflow:"hidden","white-space":"nowrap","text-overflow":"ellipsis","text-rendering":"auto"},lines!==undefined?{"-webkit-line-clamp":lines,"-webkit-box-orient":"vertical",display:"-webkit-box",height:lines*lineHeight+"px"}:null)};var clearfix=function clearfix(){return{"&:after":{content:'""',display:"table",clear:"both"}}};var hairline=function hairline(){return{}};var sticky=function sticky(){return[{position:"-webkit-sticky"},{position:"-moz-sticky"},{position:"-o-sticky"},{position:"-ms-sticky"},{position:"sticky"},{top:0,"z-index":1}]};var createStyles=function createStyles(common,fn){if(Array.isArray(common)){return common.map(function(o){for(var scope in o){return _defineProperty({},scope,fn(o[scope]))}})}else{return fn(common)}};var defaultTransition=function defaultTransition(){var properties=arguments.length<=0||arguments[0]===undefined?"all":arguments[0];var duration=arguments.length<=1||arguments[1]===undefined?_config2.default.animation_duration:arguments[1];var curve=arguments.length<=2||arguments[2]===undefined?_config2.default.animation_curve_default:arguments[2];return[vendorize({"transition-delay":0},_config2.default.prefixes_transition),vendorize({"transition-duration":duration},_config2.default.prefixes_transition),vendorize({"transition-timing-function":curve},_config2.default.prefixes_transition),vendorize({"transition-property":properties},_config2.default.prefixes_transition)]};var fluidScale=function fluidScale(property,unit,minValue,maxValue){var minBreakpoint=arguments.length<=4||arguments[4]===undefined?320:arguments[4];var maxBreakpoint=arguments.length<=5||arguments[5]===undefined?1920:arguments[5];var orientation=arguments.length<=6||arguments[6]===undefined?"horizontal":arguments[6];return fluidScales([property],unit,[[minBreakpoint,minValue],[maxBreakpoint,maxValue]],orientation)};var fluidScales=function fluidScales(property,unit,sizes,orientation){var sorted=sizes.sort();var minBreakpoints=sorted.map(function(data){return data[0]});var maxBreakpoints=sorted.map(function(data){return data[0]});maxBreakpoints.shift();maxBreakpoints.push(minBreakpoints[minBreakpoints.length-1]);var minValues=sorted.map(function(data){return data[1]});var maxValues=sorted.map(function(data){return data[1]});maxValues.shift();maxValues.push(minValues[minValues.length-1]);return sorted.map(function(data,index){return fluidRule(property,unit,orientation,minBreakpoints[index],maxBreakpoints[index],minValues[index],maxValues[index],index===0,index===sorted.length-1)})};var fluidRule=function fluidRule(property,unit){var orientation=arguments.length<=2||arguments[2]===undefined?"horizontal":arguments[2];var minBreakpoint=arguments[3];var maxBreakpoint=arguments[4];var minValue=arguments[5];var maxValue=arguments[6];var isFirst=arguments[7];var isLast=arguments[8];var orientationUnit=orientation==="vertical"?"vh":"vw";var orientationRule=orientation==="vertical"?"height":"width";var rule=isLast?["@media (min-"+orientationRule+": "+minBreakpoint+"px)"]:["@media (min-"+orientationRule+": "+minBreakpoint+"px) and (max-"+orientationRule+": "+maxBreakpoint+"px)"];var multiplier="(("+maxValue+" - "+minValue+") / ("+maxBreakpoint+" - "+minBreakpoint+") * 100"+orientationUnit+")";var adder="((("+minValue+" * "+maxBreakpoint+") - ("+maxValue+" * "+minBreakpoint+")) / ("+maxBreakpoint+" - "+minBreakpoint+")) * 1"+unit;var formula="calc("+multiplier+" + "+adder+")";var properties=Array.isArray(property)?property:[property];return[isFirst?properties.map(function(p){return _defineProperty({},p,""+minValue+unit)}):null,_defineProperty({},rule,properties.map(function(p){return _defineProperty({},p,isLast?""+maxValue+unit:formula)}))]};exports.default={clearfix:clearfix,createStyles:createStyles,defaultTransition:defaultTransition,ellipsis:ellipsis,fit:fit,fontSmoothing:fontSmoothing,fluidScale:fluidScale,fluidScales:fluidScales,hairline:hairline,sticky:sticky,vendorize:vendorize};module.exports=exports["default"];
},{"polythene/common/object.assign":7,"polythene/config/config":10}],7:[function(require,module,exports){
"use strict";if(!Object.assign){Object.defineProperty(Object,"assign",{enumerable:false,configurable:true,writable:true,value:function value(target){if(target===undefined||target===null){throw new TypeError("Cannot convert first argument to object")}var to=Object(target);for(var i=1;i<arguments.length;i++){var nextSource=arguments[i];if(nextSource===undefined||nextSource===null){continue}nextSource=Object(nextSource);var keysArray=Object.keys(nextSource);for(var nextIndex=0,len=keysArray.length;nextIndex<len;nextIndex++){var nextKey=keysArray[nextIndex];var desc=Object.getOwnPropertyDescriptor(nextSource,nextKey);if(desc!==undefined&&desc.enumerable){to[nextKey]=nextSource[nextKey]}}}return to}})}
},{}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _j2c=require("j2c");var _j2c2=_interopRequireDefault(_j2c);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var remove=function remove(id){if(id){var old=document.getElementById(id);if(old){old.parentNode.removeChild(old)}}};var add=function add(id){for(var _len=arguments.length,styles=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){styles[_key-1]=arguments[_key]}remove(id);var styleEl=document.createElement("style");if(id){styleEl.setAttribute("id",id)}styles.forEach(function(styleList){if(Object.keys(styleList).length){styleList.forEach(function(style){var scoped={"@global":style};var sheet=_j2c2.default.sheet(scoped);styleEl.appendChild(document.createTextNode(sheet))})}});document.head.appendChild(styleEl)};exports.default={add:add,remove:remove};module.exports=exports["default"];
},{"j2c":4}],9:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});if(!window.WebFontConfig){window.WebFontConfig={};(function(){var wf=document.createElement("script");wf.src=(document.location.protocol==="https:"?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";wf.type="text/javascript";wf.async="true";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(wf,s)})()}var webfontLoader={add:function add(vendor,family,key){var vendorCfg=window.WebFontConfig[vendor]||{};vendorCfg.families=vendorCfg.families||[];vendorCfg.families.push(family);if(key){vendorCfg.key=key}window.WebFontConfig[vendor]=vendorCfg}};exports.default=webfontLoader;module.exports=exports["default"];
},{}],10:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _default=require("polythene/config/default");var _default2=_interopRequireDefault(_default);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}exports.default=_default2.default;module.exports=exports["default"];
},{"polythene/config/default":12}],11:[function(require,module,exports){
"use strict";
},{}],12:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var hex=function hex(_hex){var bigint=parseInt(_hex.substring(1),16);var r=bigint>>16&255;var g=bigint>>8&255;var b=bigint&255;return r+","+g+","+b};var rgba=function rgba(colorStr){var opacity=arguments.length<=1||arguments[1]===undefined?1:arguments[1];return"rgba("+colorStr+","+opacity+")"};var isInteger=function isInteger(nVal){return typeof nVal==="number"&&isFinite(nVal)&&nVal>-9007199254740992&&nVal<9007199254740992&&Math.floor(nVal)===nVal};var isDesktop=window.innerWidth>=1024;var grid_unit=4;var grid_unit_component=8;var animation_curve_slow_in_fast_out="cubic-bezier(.4, 0, .2, 1)";var animation_curve_slow_in_linear_out="cubic-bezier(0, 0, .2, 1)";var animation_curve_linear_in_fast_out="cubic-bezier(.4, 0, 1, 1)";exports.default={rgba:rgba,hex:hex,isInteger:isInteger,grid_unit:grid_unit,grid_unit_component:grid_unit_component,grid_unit_menu:56,grid_unit_icon_button:6*grid_unit_component,unit_block_border_radius:2,unit_item_border_radius:2,unit_indent:72,unit_side_padding:isDesktop?24:16,unit_touch_height:48,unit_icon_size_small:2*grid_unit_component,unit_icon_size:3*grid_unit_component,unit_icon_size_medium:4*grid_unit_component,unit_icon_size_large:5*grid_unit_component,unit_screen_size_extra_large:1280,unit_screen_size_large:960,unit_screen_size_medium:480,unit_screen_size_small:320,animation_duration:".18s",animation_curve_slow_in_fast_out:animation_curve_slow_in_fast_out,animation_curve_slow_in_linear_out:animation_curve_slow_in_linear_out,animation_curve_linear_in_fast_out:animation_curve_linear_in_fast_out,animation_curve_default:"ease-out",font_weight_light:300,font_weight_normal:400,font_weight_medium:500,font_weight_bold:700,font_size_title:20,line_height:1.3,color_primary:"33, 150, 243",color_primary_active:"30, 136, 229",color_primary_dark:"25, 118, 210",color_primary_faded:"100, 181, 249",color_primary_foreground:"255, 255, 255",color_light_background:"255, 255, 255",color_light_foreground:"0, 0, 0",color_dark_background:"34, 34, 34",color_dark_foreground:"255, 255, 255",blend_light_text_primary:.87,blend_light_text_regular:.73,blend_light_text_secondary:.54,blend_light_text_tertiary:.4,blend_light_text_disabled:.26,blend_light_border_light:.11,blend_light_background_active:.14,blend_light_background_hover:.06,blend_light_background_hover_medium:.12,blend_light_background_disabled:.09,blend_light_overlay_background:.3,blend_dark_text_primary:1,blend_dark_text_regular:.87,blend_dark_text_secondary:.7,blend_dark_text_tertiary:.4,blend_dark_text_disabled:.26,blend_dark_border_light:.1,blend_dark_background_active:.14,blend_dark_background_hover:.08,blend_dark_background_hoverMedium:.12,blend_dark_background_disabled:.12,blend_dark_overlay_background:.3,prefixes_animation:["o","moz","webkit"],prefixes_appearance:["o","moz","ms","webkit"],prefixes_background_size:["o","moz","webkit"],prefixes_box_shadow:["moz","webkit"],prefixes_keyframes:["o","moz","webkit"],prefixes_transform:["o","moz","ms","webkit"],prefixes_transition:["o","moz","webkit"],prefixes_user_select:["moz","ms","webkit"],breakpoint_small_handset_portrait:0,breakpoint_medium_handset_portrait:360,breakpoint_large_handset_portrait:400,breakpoint_small_tablet_portrait:600,breakpoint_large_tablet_portrait:720,breakpoint_small_handset_landscape:480,breakpoint_medium_handset_landscape:600,breakpoint_large_handset_landscape:720,env_tablet:window.innerWidth>=600,env_desktop:window.innerWidth>=1024,z_menu:99,z_header_container:999,z_notification:9998,z_dialog:9999};module.exports=exports["default"];
},{}],13:[function(require,module,exports){
"use strict";var _webfontloader=require("polythene/common/webfontloader");var _webfontloader2=_interopRequireDefault(_webfontloader);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}_webfontloader2.default.add("google","Roboto:400,500,700,400italic:latin");
},{"polythene/common/webfontloader":9}],14:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});require("polythene/common/object.assign");var _mithril=require("mithril");var _mithril2=_interopRequireDefault(_mithril);require("polythene/textfield/theme/theme");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}var startEventType=window.PointerEvent?"pointerdown":"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch?"touchstart":"mousedown";var CSS_CLASSES={block:"pe-textfield",inputArea:"pe-textfield__input-area",input:"pe-textfield__input",label:"pe-textfield__label",counter:"pe-textfield__counter",help:"pe-textfield__help",focusHelp:"pe-textfield__help-focus",error:"pe-textfield__error",errorPlaceholder:"pe-textfield__error-placeholder",stateFocused:"pe-textfield--focused",stateDisabled:"pe-textfield--disabled",stateReadonly:"pe-textfield--readonly",stateInvalid:"pe-textfield--invalid",stateDirty:"pe-textfield--dirty",hasFloatingLabel:"pe-textfield--floating-label",isDense:"pe-textfield--dense",isRequired:"pe-textfield--required",hideRequiredChar:"pe-textfield--no-char",hasFullWidth:"pe-textfield--full-width",hasCounter:"pe-textfield--counter",hideSpinner:"pe-textfield--hide-spinner",hideClear:"pe-textfield--hide-clear",hideValidation:"pe-textfield--hide-validation"};var KEYBOARD_TIMEOUT=200;var validateCustom=function validateCustom(ctrl,opts){var state=opts.validate(ctrl.value);return{invalid:state&&!state.valid,message:state&&state.error}};var validateCounter=function validateCounter(ctrl,opts){return{invalid:ctrl.value.length>opts.counter,message:opts.error}};var validateHTML=function validateHTML(ctrl,opts){return{invalid:!ctrl.inputEl().checkValidity(),message:opts.error}};var getValidStatus=function getValidStatus(ctrl,opts){var status={invalid:false,message:undefined};if(!ctrl.touched&&!opts.validateAtStart){return status}if(ctrl.touched&&ctrl.isInvalid&&ctrl.value.length===0&&opts.validateResetOnClear){ctrl.touched=false;ctrl.isInvalid=false;ctrl.error=undefined}if(!status.invalid&&opts.counter){status=validateCounter(ctrl,opts)}if(!status.invalid&&ctrl.inputEl()&&ctrl.inputEl().checkValidity){status=validateHTML(ctrl,opts)}if(!status.invalid&&opts.validate){status=validateCustom(ctrl,opts)}return status};var checkValidity=function checkValidity(ctrl,opts){var status=getValidStatus(ctrl,opts);var previousInvalid=ctrl.isInvalid;ctrl.error=status.message;ctrl.isInvalid=status.invalid;if(status.invalid!==previousInvalid){setTimeout(_mithril2.default.redraw,0)}if(!status.invalid){ctrl.error=undefined}};var checkDirty=function checkDirty(ctrl){ctrl.isDirty=ctrl.value.length>0};var updateState=function updateState(ctrl,opts){checkValidity(ctrl,opts);checkDirty(ctrl)};var notifyState=function notifyState(ctrl,opts){if(opts.getState){var status=getValidStatus(ctrl,opts);opts.getState({focus:ctrl.focus(),dirty:ctrl.isDirty,value:ctrl.value,el:ctrl.inputEl(),invalid:status.invalid,error:status.error})}};var createView=function createView(ctrl){var opts=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];updateState(ctrl,opts);var isInvalid=ctrl.isInvalid;var tag=opts.tag||"div";var type=!opts.type||opts.type==="submit"||opts.type==="search"?"text":opts.type;var inputTag=opts.multiline?"textarea":"input";var showError=isInvalid&&ctrl.error;var validates=opts.validate||opts.min||opts.max||opts.minlength||opts.required||opts.pattern;var inactive=opts.disabled||opts.readonly;if(opts.focus&&!ctrl.focus()&&!inactive){ctrl.focus(true);if(ctrl.inputEl()){ctrl.inputEl().focus()}}if(typeof opts.value==="function"&&ctrl.inputEl()&&!ctrl.focus()&&!inactive){var value=opts.value();ctrl.value=value;ctrl.touched=true;updateState(ctrl,opts);notifyState(ctrl,opts);ctrl.inputEl().value=value}var onBlur=function onBlur(e){ctrl.focus(false);ctrl.touched=true;ctrl.value=e.target.value;updateState(ctrl,opts);notifyState(ctrl,opts);ctrl.el.classList.remove(CSS_CLASSES.stateFocused)};var props={"class":[CSS_CLASSES.block,isInvalid?CSS_CLASSES.stateInvalid:"",ctrl.focus()?CSS_CLASSES.stateFocused:"",opts.floatingLabel?CSS_CLASSES.hasFloatingLabel:"",opts.disabled?CSS_CLASSES.stateDisabled:"",opts.readonly?CSS_CLASSES.stateReadonly:"",ctrl.isDirty?CSS_CLASSES.stateDirty:"",opts.dense?CSS_CLASSES.isDense:"",opts.required?CSS_CLASSES.isRequired:"",opts.fullWidth?CSS_CLASSES.hasFullWidth:"",opts.counter?CSS_CLASSES.hasCounter:"",opts.hideSpinner!==false?CSS_CLASSES.hideSpinner:"",opts.hideClear!==false?CSS_CLASSES.hideClear:"",opts.hideValidation?CSS_CLASSES.hideValidation:"",opts.hideRequiredMark?CSS_CLASSES.hideRequiredChar:"",opts.class].join(" "),id:opts.id||"",config:function config(el,inited,context,vdom){if(inited){return}if(opts.config){opts.config(el,inited,context,vdom)}ctrl.el=el;if(!inactive){updateState(ctrl,opts)}}};var content=[(0,_mithril2.default)("div",{"class":CSS_CLASSES.inputArea},[opts.label?(0,_mithril2.default)("label",_defineProperty({"class":CSS_CLASSES.label},"on"+startEventType,function(){if(!inactive){setTimeout(function(){ctrl.inputEl().focus()},0)}}),opts.label):null,(0,_mithril2.default)(inputTag,Object.assign({},{"class":CSS_CLASSES.input,type:type,onclick:function onclick(){if(inactive){return}ctrl.focus(true);notifyState(ctrl,opts)},onfocus:function onfocus(){if(inactive){return}ctrl.focus(true);if(ctrl.el){ctrl.el.classList.add(CSS_CLASSES.stateFocused)}notifyState(ctrl,opts)},oninput:function oninput(e){ctrl.value=e.target.value;if(opts.validateOnInput){ctrl.touched=true}updateState(ctrl,opts);notifyState(ctrl,opts);if(opts.oninput){opts.oninput(ctrl.value,e)}},onkeydown:function onkeydown(e){if(e.which===13){ctrl.touched=true;updateState(ctrl,opts);notifyState(ctrl,opts)}else if(e.which===27){ctrl.inputEl().blur(e)}else if(e.which===9){setTimeout(function(){_mithril2.default.redraw();setTimeout(_mithril2.default.redraw,250)},1)}},config:function config(el,inited,context){if(inited){return}ctrl.inputEl(el);el.value=ctrl.value;notifyState(ctrl,opts);if(!inactive){el.addEventListener("blur",onBlur,true);context.onunload=function(){el.removeEventListener("blur",onBlur,true)}}},name:opts.name||"",disabled:opts.disabled},opts.events?opts.events:null,opts.readonly!==undefined?{readonly:true}:null,opts.pattern!==undefined?{pattern:opts.pattern}:null,opts.maxlength!==undefined?{maxlength:opts.maxlength}:null,opts.minlength!==undefined?{minlength:opts.minlength}:null,opts.max!==undefined?{max:opts.max}:null,opts.min!==undefined?{min:opts.min}:null,opts.autofocus!==undefined?{autofocus:opts.autofocus}:null,opts.required!==undefined?{required:opts.required}:null,opts.tabindex!==undefined?{tabindex:opts.tabindex}:null,opts.rows!==undefined?{rows:opts.rows}:null))]),opts.counter?(0,_mithril2.default)("div",{"class":CSS_CLASSES.counter},ctrl.value.length+" / "+opts.counter):null,opts.help&&!showError?(0,_mithril2.default)("div",{"class":[CSS_CLASSES.help,opts.focusHelp?CSS_CLASSES.focusHelp:""].join(" ")},opts.help):null,showError?(0,_mithril2.default)("div",{"class":CSS_CLASSES.error},ctrl.error):validates&&!opts.help?(0,_mithril2.default)("div",{"class":CSS_CLASSES.errorPlaceholder}):null];return(0,_mithril2.default)(tag,props,[opts.before,content,opts.after])};var component={controller:function controller(){var opts=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var value=undefined,isInvalid=false,touched=false,error=opts.error||"",el=undefined,inputEl=_mithril2.default.prop(),hasFocus=opts.focus||false;if(typeof opts.value==="function"){var v=opts.value();value=v!==undefined?v:""}else{value=opts.value!==undefined?opts.value:""}if(value!==""){touched=true}var focus=function focus(state){if(state===undefined){return hasFocus}hasFocus=state};return{value:value,error:error,el:el,inputEl:inputEl,focus:focus,isInvalid:isInvalid,touched:touched}},view:function view(ctrl){var opts=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];return createView(ctrl,opts)}};exports.default=component;module.exports=exports["default"];
},{"mithril":5,"polythene/common/object.assign":7,"polythene/textfield/theme/theme":18}],15:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _mixin=require("polythene/common/mixin");var _mixin2=_interopRequireDefault(_mixin);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}var style=function style(config,tint){var scope=arguments.length<=2||arguments[2]===undefined?"":arguments[2];return[_defineProperty({},scope+".pe-textfield",{color:config["color_"+tint+"_focus_border"]," .pe-textfield__input-area":{color:"inherit","&:after":{"background-color":"currentcolor"}},"&.pe-textfield--counter ":{" .pe-textfield__input-area:after":{"background-color":config["color_"+tint+"_counter_ok_border"]}}," .pe-textfield__input":{color:config["color_"+tint+"_input_text"],"border-color":config["color_"+tint+"_input_bottom_border"]}," .pe-textfield__label":{color:config["color_"+tint+"_label_text"]},"&.pe-textfield--disabled, &.pe-textfield--readonly":{" .pe-textfield__input-area:after":{"background-color":"transparent","background-image":"linear-gradient(to right, "+config["color_"+tint+"_disabled_label_text"]+" 20%, rgba(255, 255, 255, 0) 0%)"}},"&.pe-textfield--disabled":{" .pe-textfield__input, .pe-textfield__label":{color:config["color_"+tint+"_disabled_label_text"]}},"&.pe-textfield--readonly":{" .pe-textfield__input, .pe-textfield__label":{color:config["color_"+tint+"_readonly_label_text"]}},"&.pe-textfield--focused":{"&.pe-textfield--floating-label .pe-textfield__label":{color:config["color_"+tint+"_highlight_text"]},"&.pe-textfield--required.pe-textfield--floating-label":{" .pe-textfield__label:after":{color:config["color_"+tint+"_required_symbol"]}}}," .pe-textfield__help, .pe-textfield__counter":{color:config["color_"+tint+"_help_text"]},"&.pe-textfield--invalid:not(.pe-textfield--hide-validation)":{" .pe-textfield__input":{"border-color":config["color_"+tint+"_input_error_border"],"box-shadow":"none"}," .pe-textfield__label":{color:config["color_"+tint+"_input_error_text"]}," .pe-textfield__error, .pe-textfield__counter, .pe-textfield__help":{color:config["color_"+tint+"_input_error_text"]},"&.pe-textfield--required .pe-textfield__label":{color:config["color_"+tint+"_input_error_text"]},"&, &.pe-textfield--counter":{" .pe-textfield__input-area:after":{"background-color":config["color_"+tint+"_input_error_border"]}}}," .pe-textfield__input:-webkit-autofill":{"-webkit-box-shadow":"0 0 0px 1000px "+config["color_"+tint+"_input_background"]+" inset",color:config["color_"+tint+"_input_text"]+" !important"}})]};var createStyles=function createStyles(config){return[style(config,"light"),{".pe-dark-theme":[style(config,"dark"," "),style(config,"dark","&")]}]};exports.default=function(config){return _mixin2.default.createStyles(config,createStyles)};module.exports=exports["default"];
},{"polythene/common/mixin":6}],16:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _config=require("polythene/config/config");var _config2=_interopRequireDefault(_config);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var rgba=_config2.default.rgba;var line_height_input=20;var input_padding_v=7;exports.default={vertical_spacing_top:6,vertical_spacing_bottom:7,input_focus_border_width:2,input_focus_border_animation_duration:_config2.default.animation_duration,floating_label_vertical_spacing_top:30,floating_label_vertical_spacing_bottom:7,floating_label_top:14,floating_label_animation_duration:".12s",input_padding_h:0,input_padding_v:input_padding_v,input_border_width:1,margin_top_error_message:6,font_size_input:16,font_size_error:12,font_size_floating_label:12,line_height_input:line_height_input,dense_floating_label_vertical_spacing_top:23,dense_floating_label_vertical_spacing_bottom:4,dense_floating_label_top:10,dense_font_size_input:13,dense_font_size_floating_label:13,full_width_input_padding_h:20,full_width_input_padding_v:18,dense_full_width_input_padding_h:16,dense_full_width_input_padding_v:15,dense_full_width_font_size_input:13,color_light_input_text:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_primary),color_light_input_background:rgba(_config2.default.color_light_background),color_light_highlight_text:rgba(_config2.default.color_primary,_config2.default.blend_light_text_primary),color_light_input_bottom_border:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_border_light),color_light_input_error_text:rgba("221, 44, 0"),color_light_input_error_border:rgba("221, 44, 0"),color_light_input_placeholder:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_tertiary),color_light_label_text:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_tertiary),color_light_disabled_label_text:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_disabled),color_light_readonly_label_text:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_tertiary),color_light_help_text:rgba(_config2.default.color_light_foreground,_config2.default.blend_light_text_tertiary),color_light_required_symbol:rgba("221, 44, 0"),color_light_focus_border:rgba(_config2.default.color_primary),color_light_counter_ok_border:rgba(_config2.default.color_primary),color_dark_input_text:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_primary),color_dark_input_background:rgba(_config2.default.color_dark_background),color_dark_highlight_text:rgba(_config2.default.color_primary,_config2.default.blend_dark_text_primary),color_dark_input_bottom_border:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_border_light),color_dark_input_error_text:rgba("222, 50, 38"),color_dark_input_error_border:rgba("222, 50, 38"),color_dark_input_placeholder:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_tertiary),color_dark_label_text:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_tertiary),color_dark_disabled_label_text:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_disabled),color_dark_readonly_label_text:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_tertiary),color_dark_help_text:rgba(_config2.default.color_dark_foreground,_config2.default.blend_dark_text_tertiary),color_dark_required_symbol:rgba("221, 44, 0"),color_dark_focus_border:rgba(_config2.default.color_primary),color_dark_counter_ok_border:rgba(_config2.default.color_primary)};module.exports=exports["default"];
},{"polythene/config/config":10}],17:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _config=require("polythene/config/config");var _config2=_interopRequireDefault(_config);var _mixin=require("polythene/common/mixin");var _mixin2=_interopRequireDefault(_mixin);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var createStyles=function createStyles(config){return[{".pe-textfield":[_mixin2.default.clearfix(),{position:"relative","line-height":_config2.default.line_height,display:"inline-block","box-sizing":"border-box",margin:0,overflow:"visible","padding-bottom":config.vertical_spacing_bottom+"px",width:"100%","max-width":"100%"," .pe-textfield__input-area":{position:"relative","padding-top":config.vertical_spacing_top+"px","&:after":[_mixin2.default.defaultTransition("opacity",config.input_focus_border_animation_duration),{position:"absolute",content:'""',bottom:0,left:0,height:config.input_focus_border_width+"px",width:"100%",opacity:0}]},"&.pe-textfield--focused .pe-textfield__input-area:after":{opacity:1}," .pe-textfield__input":{display:"block","font-size":config.font_size_input+"px","line-height":config.line_height_input+"px",width:"100%",background:"none","text-align":"left",color:"inherit","border-width":config.input_border_width+"px","border-style":"none none solid none","border-radius":0,margin:0,padding:config.input_padding_v+"px "+config.input_padding_h+"px","&:textfield--invalid":{"box-shadow":"none"},":invalid":{"box-shadow":"none"}}," textarea.pe-textfield__input":{margin:config.input_padding_v+"px "+config.input_padding_h+"px",padding:0,display:"block"}," textfield__input:focus, &.pe-textfield--focused .pe-textfield__input":{"border-width":config.input_border_width+"px",outline:"none"}," .pe-textfield__label":{position:"absolute",display:"block",top:config.vertical_spacing_top+config.input_padding_v+"px",bottom:0,left:config.input_padding_h+"px",right:config.input_padding_h+"px","font-size":config.font_size_input+"px","line-height":config.line_height_input+"px","pointer-events":"none","white-space":"nowrap","text-align":"left",cursor:"text"},"&.pe-textfield--dirty .pe-textfield__label":{visibility:"hidden"},"&:not(.pe-textfield--no-char).pe-textfield--required .pe-textfield__label":{"&:after":{content:'"*"',padding:"0 0 0 .25em"}},"&.pe-textfield--floating-label":{"padding-bottom":config.floating_label_vertical_spacing_bottom+"px"," .pe-textfield__input-area":{"padding-top":config.floating_label_vertical_spacing_top+"px"}," .pe-textfield__label":[_mixin2.default.defaultTransition("all",config.floating_label_animation_duration),{top:config.floating_label_vertical_spacing_top+config.input_padding_v+"px"}],"&.pe-textfield--focused, &.pe-textfield--dirty":{" .pe-textfield__label":{"font-size":config.font_size_floating_label+"px",top:config.floating_label_top+"px",visibility:"visible"}},"&.pe-textfield--dense":{"font-size":config.dense_font_size_input+"px","padding-bottom":config.dense_floating_label_vertical_spacing_bottom+"px"," .pe-textfield__input-area":{"padding-top":config.dense_floating_label_vertical_spacing_top+"px"}," .pe-textfield__input":{"font-size":config.dense_font_size_input+"px"}," .pe-textfield__label":{"font-size":config.dense_font_size_input+"px",top:config.dense_floating_label_vertical_spacing_top+config.input_padding_v+"px"},"&.pe-textfield--focused, &.pe-textfield--dirty":{" .pe-textfield__label":{"font-size":config.dense_font_size_floating_label+"px",top:config.dense_floating_label_top+"px"}}}},"&.pe-textfield--disabled, &.pe-textfield--readonly":{" .pe-textfield__label":{cursor:"auto"}," .pe-textfield__input":{"border-bottom":"none"}," .pe-textfield__input-area:after":{opacity:1,height:"1px",bottom:"-1px","background-position":"top","background-size":"4px 1px","background-repeat":"repeat-x"}}," .pe-textfield__error, .pe-textfield__error-placeholder, .pe-textfield__help, .pe-textfield__counter":{"margin-top":config.margin_top_error_message+"px","font-size":config.font_size_error+"px","line-height":_config2.default.line_height,"min-height":config.font_size_error*_config2.default.line_height+"px"}," .pe-textfield__counter":{"text-align":"right","float":"right",padding:"0 0 0 16px"}," .pe-textfield__help-focus":[_mixin2.default.defaultTransition("opacity"),{opacity:0}],"&.pe-textfield--focused .pe-textfield__help-focus, &.pe-textfield--dirty .pe-textfield__help-focus":{opacity:1},"&.pe-textfield--hide-clear":{" .pe-textfield__input::-ms-clear":{display:"none"}},"&.pe-textfield--hide-spinner":{" input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":{"-webkit-appearance":"none",margin:0}," input[type=number]":{"-moz-appearance":"textfield"}}},{"&.pe-textfield--full-width":{width:"100%",padding:0," .pe-textfield__input-area":{padding:0}," .pe-textfield__input":{padding:config.full_width_input_padding_v+"px "+config.full_width_input_padding_h+"px"}," .pe-textfield__error, .pe-textfield__help, .pe-textfield__counter":{"padding-left":config.full_width_input_padding_h+"px","padding-right":config.full_width_input_padding_h+"px"}," .pe-textfield__label":{top:config.full_width_input_padding_v+"px",left:config.full_width_input_padding_h+"px",right:config.full_width_input_padding_h+"px"},"&.pe-textfield--dense":{" .pe-textfield__input":{"font-size":config.dense_full_width_font_size_input+"px",padding:config.dense_full_width_input_padding_v+"px "+config.dense_full_width_input_padding_h+"px"}," .pe-textfield__label":{"font-size":config.dense_full_width_font_size_input+"px",top:config.dense_full_width_input_padding_v+"px",left:config.dense_full_width_input_padding_h+"px",right:config.dense_full_width_input_padding_h+"px"}}}}]}]};exports.default=function(config){return _mixin2.default.createStyles(config,createStyles)};module.exports=exports["default"];
},{"polythene/common/mixin":6,"polythene/config/config":10}],18:[function(require,module,exports){
"use strict";var _config=require("polythene/textfield/theme/config");var _config2=_interopRequireDefault(_config);var _custom=require("polythene/config/custom");var _custom2=_interopRequireDefault(_custom);var _layout=require("polythene/textfield/theme/layout");var _layout2=_interopRequireDefault(_layout);var _color=require("polythene/textfield/theme/color");var _color2=_interopRequireDefault(_color);var _styler=require("polythene/common/styler");var _styler2=_interopRequireDefault(_styler);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var customConfigFn=_custom2.default.textfield;var config=customConfigFn?customConfigFn(_config2.default):_config2.default;_styler2.default.add("pe-textfield",(0,_layout2.default)(config),(0,_color2.default)(config));
},{"polythene/common/styler":8,"polythene/config/custom":11,"polythene/textfield/theme/color":15,"polythene/textfield/theme/config":16,"polythene/textfield/theme/layout":17}],19:[function(require,module,exports){
"use strict";var _styler=require("polythene/common/styler");var _styler2=_interopRequireDefault(_styler);require("polythene/font-roboto/theme");var _typography=require("polythene/theme/typography");var _typography2=_interopRequireDefault(_typography);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var roboto=[{"html, body, input, textarea":{"font-family":"Roboto, Helvetica, Arial, sans-serif"}}];var general=[{"*":[{"box-sizing":"border-box"},{"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},{"-webkit-tap-highlight-color":"transparent"}]," a, a:active, a:focus, input:active, input[type]:focus":{outline:0},"input:disabled":{opacity:1}}];_styler2.default.add("pe-theme",roboto,_typography2.default,general);
},{"polythene/common/styler":8,"polythene/font-roboto/theme":13,"polythene/theme/typography":20}],20:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _config=require("polythene/config/config");var _config2=_interopRequireDefault(_config);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var fontSize=14;var styles=[{" h1, h2, h3, h4, h5, h6, p":{margin:0,padding:0}},{" h1 small, h2 small, h3 small, h4 small, h5 small, h6 small":{"font-weight":_config2.default.font_weight_normal,"line-height":_config2.default.line_height,"letter-spacing":"-0.02em","font-size":"0.6em"}},{" h1":{"font-size":"56px","font-weight":_config2.default.font_weight_normal,"line-height":_config2.default.line_height,"margin-top":"24px","margin-bottom":"24px"}},{" h2":{"font-size":"45px","font-weight":_config2.default.font_weight_normal,"line-height":"48px","margin-top":"24px","margin-bottom":"24px"}},{" h3":{"font-size":"34px","font-weight":_config2.default.font_weight_normal,"line-height":"40px","margin-top":"24px","margin-bottom":"24px"}},{" h4":{"font-size":"24px","font-weight":_config2.default.font_weight_normal,"line-height":"32px","-moz-osx-font-smoothing":"grayscale","margin-top":"24px","margin-bottom":"16px"}},{" h5":{"font-size":"20px","font-weight":_config2.default.font_weight_medium,"line-height":"1","letter-spacing":"-0.02em","margin-top":"24px","margin-bottom":"16px"}},{" h6":{"font-size":"16px","font-weight":_config2.default.font_weight_normal,"line-height":"24px","letter-spacing":"0.04em","margin-top":"24px","margin-bottom":"16px"}},{" html, body":{"font-size":fontSize+"px","line-height":"20px","font-weight":_config2.default.font_weight_normal}," p":{"font-size":fontSize+"px","font-weight":_config2.default.font_weight_normal,"line-height":"24px","letter-spacing":"0","margin-bottom":"16px"}," blockquote":{position:"relative","font-size":"24px","font-weight":_config2.default.font_weight_normal,"font-style":"italic","line-height":_config2.default.line_height,"letter-spacing":"0.08em","margin-top":"24px","margin-bottom":"16px"}," ul, ol":{"font-size":fontSize+"px","font-weight":_config2.default.font_weight_normal,"line-height":"24px","letter-spacing":0},"b, strong":{"font-weight":_config2.default.font_weight_medium}}];exports.default=styles;module.exports=exports["default"];
},{"polythene/config/config":10}]},{},[3]);
