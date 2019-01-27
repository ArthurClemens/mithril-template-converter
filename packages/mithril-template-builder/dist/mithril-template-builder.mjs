function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// @ts-check

/**
 * @typedef {{tag: string, attrs: object, children: Array<Vnode>}} Vnode
 */

/**
 * @type {RegExp} ENTITY_REGEX
 */
var ENTITY_REGEX = /(&#?\w+;)/;
var svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];
var svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach(function (term) {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});
/**
 * @param {Array} list 
 * @param {function} f 
 */

function each(list, f) {
  for (var i = 0; i < list.length; i++) {
    f(list[i], i);
  }
}
/**
 * @param {string} markup 
 * @returns {Array<ChildNode>}
 */


function createFragment(markup) {
  // escape HTML entities, to be resolved in addVirtualString
  markup = markup.replace(/&/g, "&amp;");

  if (markup.indexOf("<!doctype") >= 0) {
    return [new DOMParser().parseFromString(markup, "text/html").childNodes[1]];
  }

  var container = document.createElement("div");
  container.insertAdjacentHTML("beforeend", markup);
  return _toConsumableArray(container.childNodes);
}
/**
 * @param {Array<Node>|Array<ChildNode>} fragment 
 * @returns {Array<Vnode>}
 */


function createVirtual(fragment) {
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
}
/**
 * 
 * @param {Array<Vnode>} virtual 
 */


function TemplateBuilder(virtual) {
  this.virtual = virtual;
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
    var virtual = vnode.tag === "div" ? "" : vnode.tag;

    if (vnode.attrs.class) {
      var attrs = vnode.attrs.class.replace(/\s+/g, ".");
      virtual += ".".concat(attrs);
      vnode.attrs.class = undefined;
    }

    each(Object.keys(vnode.attrs).sort(), function (attrName) {
      if (attrName === "style") return;
      if (vnode.attrs[attrName] === undefined) return;
      var attrs = vnode.attrs[attrName];
      attrs = attrs.replace(/[\n\r\t]/g, " ");
      attrs = attrs.replace(/\s+/g, " "); // clean up redundant spaces we just created

      attrs = attrs.replace(/'/g, "\\'"); // escape quotes

      virtual += "[".concat(attrName, "='").concat(attrs, "']");
    });
    if (virtual === "") virtual = "div";
    virtual = "\"".concat(virtual, "\""); // add quotes

    if (vnode.attrs.style) {
      var _attrs = vnode.attrs.style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon


      _attrs = _attrs.replace(/[\n\r]/g, ""); // remove newlines

      _attrs = _attrs.split(/\s*;\s*/); // ["color:#f00", "border: 1px solid red"]

      _attrs = _attrs.map(function (propValue) {
        // "color:#f00"
        return propValue.split(/\s*:\s*/).map(function (part) {
          return "\"".concat(part, "\"");
        }).join(": "); // "\"color\": \"#f00\""
      });
      _attrs = _attrs.join(", ");
      virtual += ", {style: {".concat(_attrs, "}}");
    }

    var children = vnode.children.length !== 0 ? new TemplateBuilder(vnode.children).complete() : null;
    this.children.push({
      node: virtual,
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
 * @param {string} children 
 * @param {string} whitespace 
 * @param {string} indent 
 * @returns {string}
 */


var mithrilNodeMultipleChildrenTemplate = function mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ",\n").concat(whitespace).concat(indent, "[").concat(children, "\n").concat(whitespace).concat(indent, "]\n").concat(whitespace, ")");
};
/**
 * @param {string} mithrilNode 
 * @param {string} child 
 * @param {string} whitespace 
 * @returns {string}
 */


var mithrilNodeSingleChildTemplate = function mithrilNodeSingleChildTemplate(mithrilNode, child, whitespace) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ", ").concat(child, "\n").concat(whitespace, ")");
};
/**
 * @param {string} mithrilNode 
 * @param {string} children 
 * @param {string} whitespace 
 * @param {string} indent 
 * @returns {string}
 */


var template = function template(mithrilNode, children, whitespace, indent) {
  return children ? children.length > 1 ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent) : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace) : singleMithrilNodeTemplate(mithrilNode, whitespace);
};
/**
 * @param {Array} data 
 * @param {number} level 
 * @param {string} indent 
 */


var formatCode = function formatCode(data, level, indent) {
  if (!data) {
    return "";
  }

  return data.map(function (d) {
    var space = whitespace(level, indent);

    if (d.content) {
      return contentTemplate(d.content, space);
    }

    var node = d.node || "";
    var newLevel = level + (d.children && d.children.length > 1 ? 2 : 1);
    var children = formatCode(d.children, newLevel, indent) || "";
    return template(node, children, space, indent);
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
 * @param {"2" | "4" | "tab"} opts.indent
 * @returns {string}
 */

var templateBuilder = function templateBuilder(opts) {
  var fragment = createFragment(opts.source);
  var source = createVirtual(fragment);
  var parsed = new TemplateBuilder(source).complete();
  var indentLevel = parsed.length > 1 ? 1 : 0;
  var indentChars = indentCharsMap[opts.indent || "4"];
  var formatted = formatCode(parsed, indentLevel, indentChars); // only wrap output in brackets when it is a list

  var wrapped = formatted.length > 1 ? wrapperTemplate(formatted.join(", ")) : formatted.join("").trim();
  return wrapped;
};

export { templateBuilder };
