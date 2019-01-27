// @ts-check

/**
 * @typedef {{tag: string, attrs: object, children: Array<Vnode>}} Vnode
 */

/**
 * @type {RegExp} ENTITY_REGEX
 */
const ENTITY_REGEX = /(&#?\w+;)/;

const svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];

const svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach((term) => {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

/**
 * @param {Array} list 
 * @param {function} f 
 */
function each(list, f) {
  for (let i = 0; i < list.length; i++) {
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
    return [
      new DOMParser()
        .parseFromString(markup, "text/html")
        .childNodes[1]
    ];
  }
  const container = document.createElement("div");
  container.insertAdjacentHTML("beforeend", markup);
  return [...container.childNodes];
}

/**
 * @param {Array<Node>|Array<ChildNode>} fragment 
 * @returns {Array<Vnode>}
 */
function createVirtual(fragment) {
  const list = [];

  each(fragment, function(el) {
    if (el.nodeType === 3) {
      list.push(el.nodeValue);
    } else if (el.nodeType === 1) {
      const attrs = {};
      each(el.attributes, function(attr) {
        attrs[attr.name] = attr.value;
      });

      const tag = el.nodeName.toLowerCase();
      const caseTag = svgCaseSensitiveTagNamesMap[tag] ? svgCaseSensitiveTagNamesMap[tag] : tag;

      list.push({
        tag: caseTag,
        attrs,
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
  addVirtualString: function(el) {
    const content = el.replace(/(["\r\n])/g, "\\$1");
    // handle HTML entities
    const contentWithEntities = content.split(ENTITY_REGEX);
    if (contentWithEntities.length > 1) {
      contentWithEntities.forEach((part) => {
        if (part.match(ENTITY_REGEX)) {
          this.children.push({
            content: `m.trust("${part}")`
          });
        } else if (part) {
          this.children.push({
            content: `"${part}"`
          });
        }
      });
    } else {
      this.children.push({
        content: `"${content}"`
      });
    }
  },

  /**
   * @param {object} vnode 
   */
  addVirtualAttrs: function(vnode) {
    let virtual = vnode.tag === "div" ? "" : vnode.tag;

    if (vnode.attrs.class) {
      let attrs = vnode.attrs.class.replace(/\s+/g, ".");
      virtual += `.${attrs}`;
      vnode.attrs.class = undefined;
    }

    each(Object.keys(vnode.attrs).sort(), function(attrName) {
      if (attrName === "style") return;
      if (vnode.attrs[attrName] === undefined) return;
      let attrs = vnode.attrs[attrName];
      attrs = attrs.replace(/[\n\r\t]/g, " ");
      attrs = attrs.replace(/\s+/g, " "); // clean up redundant spaces we just created
      attrs = attrs.replace(/'/g, "\\'"); // escape quotes
      virtual += `[${attrName}='${attrs}']`;
    });

    if (virtual === "") virtual = "div";
    virtual = `"${virtual}"`; // add quotes

    if (vnode.attrs.style) {
      let attrs = vnode.attrs.style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon
      attrs = attrs.replace(/[\n\r]/g, ""); // remove newlines
      attrs = attrs.split(/\s*;\s*/); // ["color:#f00", "border: 1px solid red"]
      attrs = attrs.map((propValue) => {
        // "color:#f00"
        return propValue.split(/\s*:\s*/).map((part) => {
          return `"${part}"`;
        }).join(": "); // "\"color\": \"#f00\""
      });
      attrs = attrs.join(", ");
      virtual += `, {style: {${attrs}}}`;
    }

    const children = (vnode.children.length !== 0) ?
      new TemplateBuilder(vnode.children).complete() :
      null;

    this.children.push({
      node: virtual,
      children
    });
  },

  complete: function() {
    each(this.virtual, function(vnode) {
      if (typeof vnode === "string") {
        const trimmed = vnode.trim();
        const charCode = trimmed.charCodeAt(0);
        // dimiss:
        // - empty strings
        // - single escaped quotes
        // - single newlines
        // - characters with char code lower than SPACE, but allow newlines in multiline text
        if (
          trimmed.length !== 0
          && trimmed !== "\""
          && !(trimmed.length === 1 && charCode === 10)
          && (charCode === 10 || charCode >= 32)
        ) {
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
const whitespace = (level, indent) => {
  if (level < 0) return "";
  let whitespace = "";
  for (var i = 0; i < level; i++) {
    whitespace += indent;
  }
  return whitespace;
};

/**
 * @param {string} content 
 * @returns {string}
 */
const wrapperTemplate = content => (
  `[${content}\n]`
);

/**
 * @param {string} content 
 * @param {string} whitespace 
 * @returns {string}
 */
const contentTemplate = (content, whitespace) => (
  `\n${whitespace}${content}`
);

/**
 * @param {string} mithrilNode 
 * @param {string} whitespace 
 * @returns {string}
 */
const singleMithrilNodeTemplate = (mithrilNode, whitespace) => (
  `\n${whitespace}m(${mithrilNode})`
);

/**
 * @param {string} mithrilNode 
 * @param {string} children 
 * @param {string} whitespace 
 * @param {string} indent 
 * @returns {string}
 */
const mithrilNodeMultipleChildrenTemplate = (mithrilNode, children, whitespace, indent) => (
  `\n${whitespace}m(${mithrilNode},
${whitespace}${indent}[${children}
${whitespace}${indent}]
${whitespace})`
);

/**
 * @param {string} mithrilNode 
 * @param {string} child 
 * @param {string} whitespace 
 * @returns {string}
 */
const mithrilNodeSingleChildTemplate = (mithrilNode, child, whitespace) => (
  `\n${whitespace}m(${mithrilNode}, ${child}
${whitespace})`
);

/**
 * @param {string} mithrilNode 
 * @param {string} children 
 * @param {string} whitespace 
 * @param {string} indent 
 * @returns {string}
 */
const template = (mithrilNode, children, whitespace, indent) => (
  children
    ? children.length > 1
      ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent)
      : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace)
    : singleMithrilNodeTemplate(mithrilNode, whitespace)
);

/**
 * @param {Array} data 
 * @param {number} level 
 * @param {string} indent 
 */
const formatCode = (data, level, indent) => {
  if (!data) {
    return "";
  }
  return data.map((d) => {
    const space = whitespace(level, indent);
    if (d.content) {
      return contentTemplate(d.content, space);
    }
    const node = d.node || "";
    const newLevel = level + (d.children && d.children.length > 1 ? 2 : 1);
    const children = formatCode(d.children, newLevel, indent) || "";
    return template(node, children, space, indent);
  });
};

const indentCharsMap = {
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
export const templateBuilder = opts => {
  const fragment = createFragment(opts.source);
  const source = createVirtual(fragment);
  const parsed = new TemplateBuilder(source).complete();
  const indentLevel = parsed.length > 1 ?
    1 :
    0;
  const indentChars = indentCharsMap[opts.indent || "4"];
  const formatted = formatCode(parsed, indentLevel, indentChars);

  // only wrap output in brackets when it is a list
  const wrapped = formatted.length > 1 ?
    wrapperTemplate(formatted.join(", ")) :
    formatted.join("").trim();
  return wrapped;
};
