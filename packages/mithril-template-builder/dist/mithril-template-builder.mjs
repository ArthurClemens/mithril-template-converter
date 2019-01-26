var ENTITY_REGEX = /(&#?\w+;)/;
var svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];
var svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach(function (term) {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

function each(list, f) {
  for (var i = 0; i < list.length; i++) {
    f(list[i], i);
  }
}

function createFragment(markup) {
  // escape HTML entities, to be resolved in addVirtualString
  markup = markup.replace(/&/g, "&amp;");

  if (markup.indexOf("<!doctype") >= 0) {
    return [new DOMParser().parseFromString(markup, "text/html").childNodes[1]];
  }

  var container = document.createElement("div");
  container.insertAdjacentHTML("beforeend", markup);
  return container.childNodes;
}

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
  addVirtualAttrs: function addVirtualAttrs(el) {
    var virtual = el.tag === "div" ? "" : el.tag;

    if (el.attrs.class) {
      var attrs = el.attrs.class.replace(/\s+/g, ".");
      virtual += ".".concat(attrs);
      el.attrs.class = undefined;
    }

    each(Object.keys(el.attrs).sort(), function (attrName) {
      if (attrName === "style") return;
      if (el.attrs[attrName] === undefined) return;
      var attrs = el.attrs[attrName];
      attrs = attrs.replace(/[\n\r\t]/g, " ");
      attrs = attrs.replace(/\s+/g, " "); // clean up redundant spaces we just created

      attrs = attrs.replace(/'/g, "\\'"); // escape quotes

      virtual += "[".concat(attrName, "='").concat(attrs, "']");
    });
    if (virtual === "") virtual = "div";
    virtual = "\"".concat(virtual, "\""); // add quotes

    if (el.attrs.style) {
      var _attrs = el.attrs.style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon


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

    var children = el.children.length !== 0 ? new TemplateBuilder(el.children).complete() : null;
    this.children.push({
      node: virtual,
      children: children
    });
  },
  complete: function complete() {
    each(this.virtual, function (el) {
      if (typeof el === "string") {
        var trimmed = el.trim();
        var charCode = trimmed.charCodeAt(); // dimiss:
        // - empty strings
        // - single escaped quotes
        // - single newlines
        // - characters with char code lower than SPACE, but allow newlines in multiline text

        if (trimmed.length !== 0 && trimmed !== "\"" && !(trimmed.length === 1 && charCode === 10) && (charCode === 10 || charCode >= 32)) {
          this.addVirtualString(trimmed);
        }
      } else {
        this.addVirtualAttrs(el);
      }
    }.bind(this));
    return this.children;
  }
};

var whitespace = function whitespace(level, indent) {
  if (level < 0) return "";
  var whitespace = "";

  for (var i = 0; i < level; i++) {
    whitespace += indent;
  }

  return whitespace;
};

var wrapperTemplate = function wrapperTemplate(content) {
  return "[".concat(content, "\n]");
};

var contentTemplate = function contentTemplate(content, whitespace) {
  return "\n".concat(whitespace).concat(content);
};

var singleMithrilNodeTemplate = function singleMithrilNodeTemplate(mithrilNode, children, whitespace) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ")");
};

var mithrilNodeMultipleChildrenTemplate = function mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ",\n").concat(whitespace).concat(indent, "[").concat(children, "\n").concat(whitespace).concat(indent, "]\n").concat(whitespace, ")");
};

var mithrilNodeSingleChildTemplate = function mithrilNodeSingleChildTemplate(mithrilNode, child, whitespace) {
  return "\n".concat(whitespace, "m(").concat(mithrilNode, ", ").concat(child, "\n").concat(whitespace, ")");
};

var template = function template(mithrilNode, children, whitespace, indent) {
  return children ? children.length > 1 ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent) : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace, indent) : singleMithrilNodeTemplate(mithrilNode, children, whitespace, indent);
};

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
/*
opts: {
  source: string containing HTML markup
  indent: either "2", "4" or "tab"
}
*/

var templateBuilder = function templateBuilder(opts) {
  var source = createVirtual(createFragment(opts.source));
  var parsed = new TemplateBuilder(source).complete();
  var indentLevel = parsed.length > 1 ? 1 : 0;
  var indentChars = indentCharsMap[opts.indent || "4"];
  var formatted = formatCode(parsed, indentLevel, indentChars); // only wrap output in brackets when it is a list

  var wrapped = formatted.length > 1 ? wrapperTemplate(formatted.join(", ")) : formatted.join("").trim();
  return wrapped;
};

export { templateBuilder };
