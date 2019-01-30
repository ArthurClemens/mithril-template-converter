function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

// @ts-check

/**
 * @typedef {{tag: string, attrs: object, children: Array<Vnode>}} Vnode
 */

/**
 * @type {RegExp} ENTITY_REGEX
 */
var ENTITY_REGEX = /(&#?\w+;)/;
var DEFAULT_INDENT = "2";
var svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];
var svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach(function (term) {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});
/**
 * @param {Array} list 
 * @param {function} f 
 */

var each = function each(list, f) {
  for (var i = 0; i < list.length; i++) {
    f(list[i], i);
  }
};
/**
 * @param {string} markup 
 * @returns {Array<ChildNode>}
 */


var createFragment = function createFragment(markup) {
  // escape HTML entities, to be resolved in addVirtualString
  markup = markup.replace(/&/g, "&amp;");

  if (markup.indexOf("<!doctype") >= 0) {
    return [new DOMParser().parseFromString(markup, "text/html").childNodes[1]];
  }

  var container = document.createElement("div");
  container.insertAdjacentHTML("beforeend", markup);
  return _toConsumableArray(container.childNodes);
};
/**
 * @param {Array<Node>|Array<ChildNode>} fragment 
 * @returns {Array<Vnode>}
 */


var createVirtual = function createVirtual(fragment) {
  var list = [];
  each(fragment, function (el) {
    if (el.nodeType === 3) {
      list.push(el.nodeValue);
    } else if (el.nodeType === 1) {
      var attrs = {};
      each(el.attributes, function (attr) {
        attrs[attr.name] = attr.value;
      });
      var tag = el.nodeName.toLowerCase();
      var caseTag = svgCaseSensitiveTagNamesMap[tag] ? svgCaseSensitiveTagNamesMap[tag] : tag;
      list.push({
        tag: caseTag,
        attrs: attrs,
        children: createVirtual(el.childNodes)
      });
    }
  });
  return list;
};
/**
 * @param {string} style 
 * @returns {Array<Array<string>>}
 */


var styleToList = function styleToList(style) {
  var styleAttrs = style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon

  styleAttrs = styleAttrs.replace(/[\n\r]/g, ""); // remove newlines

  var list = styleAttrs.split(/\s*;\s*/); // ["color:#f00", "border:1px solid red"]

  var styleList = list.map(function (propValue) {
    return propValue.split(/\s*:\s*/);
  });
  return styleList;
};
/**
 * @param {Array<Array<string>>} styleList 
 * @returns {object}
 */


var styleListToObject = function styleListToObject(styleList) {
  var obj = styleList.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    acc[key] = value;
    return acc;
  }, {});
  return obj;
};
/**
 * 
 * @param {Array<Vnode>} virtual 
 * @param {object} opts
 * @param {boolean} [opts.attrsAsObject]
 */


function TemplateBuilder(virtual) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      attrsAsObject = _ref3.attrsAsObject;

  this.virtual = virtual;
  this.attrsAsObject = attrsAsObject;
  this.children = []; // each child is an object with attributes: node, children, content
}

TemplateBuilder.prototype = {
  addVirtualString: function addVirtualString(el) {
    var _this = this;

    var content = el.replace(/(["\r\n])/g, "\\$1"); // handle HTML entities

    var contentWithEntities = content.split(ENTITY_REGEX);

    if (contentWithEntities.length > 1) {
      contentWithEntities.forEach(function (part) {
        if (part.match(ENTITY_REGEX)) {
          _this.children.push({
            content: "m.trust(\"".concat(part, "\")")
          });
        } else if (part) {
          _this.children.push({
            content: "\"".concat(part, "\"")
          });
        }
      });
    } else {
      this.children.push({
        content: "\"".concat(content, "\"")
      });
    }
  },

  /**
   * @param {object} vnode 
   */
  addVirtualAttrs: function addVirtualAttrs(vnode) {
    var template = function template(_ref4) {
      var tag = _ref4.tag,
          className = _ref4.className,
          attrsAsString = _ref4.attrsAsString,
          attrsAsObject = _ref4.attrsAsObject,
          style = _ref4.style;
      return "\"".concat(tag).concat(className).concat(attrsAsString, "\"").concat(attrsAsObject).concat(style);
    };

    var defaultTag = "div";
    var data = {
      tag: "",
      className: "",
      attrsAsString: "",
      attrsAsObject: "",
      style: ""
    };

    var _vnode$attrs = vnode.attrs,
        _vnode$attrs$class = _vnode$attrs.class,
        className = _vnode$attrs$class === void 0 ? "" : _vnode$attrs$class,
        _vnode$attrs$style = _vnode$attrs.style,
        style = _vnode$attrs$style === void 0 ? "" : _vnode$attrs$style,
        attrs = _objectWithoutProperties(_vnode$attrs, ["class", "style"]);

    var validAttrs = Object.keys(attrs).filter(function (name) {
      return attrs[name] !== undefined;
    }).reduce(function (obj, key) {
      obj[key] = attrs[key];
      return obj;
    }, {});

    if (!this.attrsAsObject) {
      // tag
      data.tag = vnode.tag === defaultTag ? Object.keys(validAttrs).length === 0 ? "div" : "" : vnode.tag; // className

      data.className = className ? ".".concat(className.replace(/\s+/g, ".")) : ""; // attrs

      data.attrsAsString = Object.keys(validAttrs).map(function (name) {
        var value = vnode.attrs[name].replace(/[\n\r\t]/g, " ").replace(/\s+/g, " ") // clean up redundant spaces we just created
        .replace(/'/g, "\\'"); // escape quotes

        return "[".concat(name, "='").concat(value, "']");
      }).join(""); // style

      if (style) {
        var styleList = styleToList(style);
        var styleAttrs = styleListToObject(styleList);
        var styleAttrsString = JSON.stringify(styleAttrs);
        data.style = ", {\"style\":".concat(styleAttrsString, "}");
      }
    } else {
      var _styleAttrs = style ? styleListToObject(styleToList(style)) : {};

      var withStyleAttrs = _objectSpread({}, className.length > 0 ? {
        class: className
      } : {}, attrs, Object.keys(_styleAttrs).length > 0 ? {
        style: _styleAttrs
      } : {}); // tag


      data.tag = vnode.tag || defaultTag;

      if (Object.keys(withStyleAttrs).length > 0) {
        data.attrsAsObject = ", ".concat(JSON.stringify(withStyleAttrs));
      }
    }

    var children = vnode.children.length !== 0 ? new TemplateBuilder(vnode.children, {
      attrsAsObject: this.attrsAsObject
    }).complete() : null;
    this.children.push({
      node: template(data),
      children: children
    });
  },
  complete: function complete() {
    each(this.virtual, function (vnode) {
      if (typeof vnode === "string") {
        var trimmed = vnode.trim();
        var charCode = trimmed.charCodeAt(0); // dimiss:
        // - empty strings
        // - single escaped quotes
        // - single newlines
        // - characters with char code lower than SPACE, but allow newlines in multiline text

        if (trimmed.length !== 0 && trimmed !== "\"" && !(trimmed.length === 1 && charCode === 10) && (charCode === 10 || charCode >= 32)) {
          this.addVirtualString(trimmed);
        }
      } else {
        this.addVirtualAttrs(vnode);
      }
    }.bind(this));
    return this.children;
  }
};
/**
 * @param {number} level 
 * @param {string} indent 
 * @returns {string}
 */

var whitespace = function whitespace(level, indent) {
  if (level < 0) return "";
  var whitespace = "";

  for (var i = 0; i < level; i++) {
    whitespace += indent;
  }

  return whitespace;
};
/**
 * @param {string} content 
 * @returns {string}
 */


var wrapperTemplate = function wrapperTemplate(content) {
  return "[".concat(content, "\n]");
};
/**
 * @param {string} content 
 * @param {string} whitespace 
 * @returns {string}
 */


var contentTemplate = function contentTemplate(content, whitespace) {
  return "\n".concat(whitespace).concat(content);
};
/**
 * @param {string} mithrilNode 
 * @param {string} whitespace 
 * @returns {string}
 */


var singleMithrilNodeTemplate = function singleMithrilNodeTemplate(mithrilNode, whitespace) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ")");
};
/**
 * @param {string} mithrilNode 
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @param {string} indentChars
 * @returns {string}
 */


var mithrilNodeMultipleChildrenTemplate = function mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indentChars) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ",\n").concat(whitespace).concat(indentChars, "[").concat(children, "\n").concat(whitespace).concat(indentChars, "]\n").concat(whitespace, ")");
};
/**
 * @param {string} mithrilNode 
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @returns {string}
 */


var mithrilNodeSingleChildTemplate = function mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ", ").concat(children, "\n").concat(whitespace, ")");
};
/**
 * @param {string} mithrilNode 
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @param {string} indentChars
 * @returns {string}
 */


var template = function template(mithrilNode, children, whitespace, indentChars) {
  return children ? children.length > 1 ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indentChars) : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace) : singleMithrilNodeTemplate(mithrilNode, whitespace);
};
/**
 * @param {Array} data 
 * @param {number} level 
 * @param {string} indentChars
 * @returns {Array<string>}
 */


var formatCode = function formatCode(data, level, indentChars) {
  if (!data) {
    return;
  }

  return data.map(function (d) {
    var space = whitespace(level, indentChars);

    if (d.content) {
      return contentTemplate(d.content, space);
    }

    var node = d.node || "";
    var newLevel = level + (d.children && d.children.length > 1 ? 2 : 1);
    var children = formatCode(d.children, newLevel, indentChars);
    return template(node, children, space, indentChars);
  });
};

var indentCharsMap = {
  "2": "  ",
  "4": "    ",
  "tab": "\t"
};
/**
 * @param {object} opts 
 * @param {string} opts.source - String containing HTML markup
 * @param {("2" | "4" | "tab")} [opts.indent]
 * @param {boolean} [opts.attrsAsObject]
 * @returns {string}
 */

var templateBuilder = function templateBuilder(opts) {
  var fragment = createFragment(opts.source);
  var source = createVirtual(fragment);
  var parsed = new TemplateBuilder(source, {
    attrsAsObject: opts.attrsAsObject
  }).complete();
  var indentLevel = parsed.length > 1 ? 1 : 0;
  var indentChars = indentCharsMap[opts.indent || DEFAULT_INDENT];
  var formatted = formatCode(parsed, indentLevel, indentChars); // only wrap output in brackets when it is a list

  var wrapped = formatted.length > 1 ? wrapperTemplate(formatted.join(", ")) : formatted.join("").trim();
  return wrapped;
};

export default templateBuilder;
