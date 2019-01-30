// @ts-check

/**
 * @typedef {{tag: string, attrs: object, children: Array<Vnode>}} Vnode
 */

/**
 * @type {RegExp} ENTITY_REGEX
 */
const ENTITY_REGEX = /(&#?\w+;)/;
const DEFAULT_INDENT = "2";

const svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];

const svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach((term) => {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

/**
 * @param {Array} list 
 * @param {function} f 
 */
const each = (list, f) => {
  for (let i = 0; i < list.length; i++) {
    f(list[i], i);
  }
};

/**
 * @param {string} markup 
 * @returns {Array<ChildNode>}
 */
const createFragment = markup => {
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
};

/**
 * @param {Array<Node>|Array<ChildNode>} fragment 
 * @returns {Array<Vnode>}
 */
const createVirtual = fragment => {
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
};

/**
 * @param {string} style 
 * @returns {Array<Array<string>>}
 */
const styleToList = style => {
  let styleAttrs = style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon
  styleAttrs = styleAttrs.replace(/[\n\r]/g, "");     // remove newlines
  const list = styleAttrs.split(/\s*;\s*/);           // ["color:#f00", "border:1px solid red"]
  const styleList = list.map(propValue =>
    propValue.split(/\s*:\s*/)
  );
  return styleList;
};

/**
 * @param {Array<Array<string>>} styleList 
 * @returns {object}
 */
const styleListToObject = styleList => {
  const obj = styleList.reduce((acc, [key, value]) => {
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
function TemplateBuilder(virtual, { attrsAsObject } = {}) {
  this.virtual = virtual;
  this.attrsAsObject = attrsAsObject;
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

    const template = ({ tag, className, attrsAsString, attrsAsObject, style }) => `"${tag}${className}${attrsAsString}"${attrsAsObject}${style}`;
    const defaultTag = "div";

    const data = {
      tag: "",
      className: "",
      attrsAsString: "",
      attrsAsObject: "",
      style: ""
    };

    const { class: className = "", style = "", ...attrs } = vnode.attrs;
    
    const validAttrs = Object.keys(attrs)
      .filter(name => attrs[name] !== undefined)
      .reduce((obj, key) => {
        obj[key] = attrs[key];
        return obj;
      }, {});
      
    if (!this.attrsAsObject) {
      
      // tag
      data.tag = vnode.tag === defaultTag
        ? Object.keys(validAttrs).length === 0
          ? "div"
          : ""
        : vnode.tag;
      
      // className
      data.className = className
        ? `.${className.replace(/\s+/g, ".")}`
        : "";

      // attrs
      data.attrsAsString = Object.keys(validAttrs)
        .map(name => {
          const value = vnode.attrs[name]
            .replace(/[\n\r\t]/g, " ")
            .replace(/\s+/g, " ")       // clean up redundant spaces we just created
            .replace(/'/g, "\\'");      // escape quotes
          return `[${name}='${value}']`;
        })
        .join("");

      // style
      if (style) {
        const styleList = styleToList(style);
        const styleAttrs = styleListToObject(styleList);
        const styleAttrsString = JSON.stringify(styleAttrs);
        data.style = `, {"style":${styleAttrsString}}`;
      }

    } else { 
      const styleAttrs = style
        ? styleListToObject(styleToList(style))
        : {};
      const withStyleAttrs = {
        // className
        ...(className.length > 0
          ? { class: className }
          : {}
        ),
        // attrs
        ...attrs,
        // style
        ...(Object.keys(styleAttrs).length > 0
          ? { style: styleAttrs}
          : {}
        )
      };

      // tag
      data.tag = vnode.tag || defaultTag;

      if (Object.keys(withStyleAttrs).length > 0) {
        data.attrsAsObject = `, ${JSON.stringify(withStyleAttrs)}`;
      }
    }

    const children = (vnode.children.length !== 0)
      ? new TemplateBuilder(vnode.children, { attrsAsObject: this.attrsAsObject }).complete()
      : null;

    this.children.push({
      node: template(data),
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
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @param {string} indentChars
 * @returns {string}
 */
const mithrilNodeMultipleChildrenTemplate = (mithrilNode, children, whitespace, indentChars) => (
  `\n${whitespace}m(${mithrilNode},
${whitespace}${indentChars}[${children}
${whitespace}${indentChars}]
${whitespace})`
);

/**
 * @param {string} mithrilNode 
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @returns {string}
 */
const mithrilNodeSingleChildTemplate = (mithrilNode, children, whitespace) => (
  `\n${whitespace}m(${mithrilNode}, ${children}
${whitespace})`
);

/**
 * @param {string} mithrilNode 
 * @param {Array<string>} children 
 * @param {string} whitespace 
 * @param {string} indentChars
 * @returns {string}
 */
const template = (mithrilNode, children, whitespace, indentChars) => (
  console.log("children", children),
  children
    ? children.length > 1
      ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indentChars)
      : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace)
    : singleMithrilNodeTemplate(mithrilNode, whitespace)
);

/**
 * @param {Array} data 
 * @param {number} level 
 * @param {string} indentChars
 * @returns {Array<string>}
 */
const formatCode = (data, level, indentChars) => {
  if (!data) {
    return;
  }
  return data.map((d) => {
    const space = whitespace(level, indentChars);
    if (d.content) {
      return contentTemplate(d.content, space);
    }
    const node = d.node || "";
    const newLevel = level + (d.children && d.children.length > 1 ? 2 : 1);
    const children = formatCode(d.children, newLevel, indentChars);
    return template(node, children, space, indentChars);
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
 * @param {("2" | "4" | "tab")} [opts.indent]
 * @param {boolean} [opts.attrsAsObject]
 * @returns {string}
 */
const templateBuilder = opts => {
  const fragment = createFragment(opts.source);
  const source = createVirtual(fragment);
  const parsed = new TemplateBuilder(source, { attrsAsObject: opts.attrsAsObject }).complete();
  const indentLevel = parsed.length > 1 ?
    1 :
    0;
  const indentChars = indentCharsMap[opts.indent || DEFAULT_INDENT];
  const formatted = formatCode(parsed, indentLevel, indentChars);

  // only wrap output in brackets when it is a list
  const wrapped = formatted.length > 1 ?
    wrapperTemplate(formatted.join(", ")) :
    formatted.join("").trim();
  return wrapped;
};

export default templateBuilder;
