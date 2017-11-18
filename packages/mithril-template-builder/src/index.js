
const ENTITY_REGEX = /(&#?\w+;)/;

const svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];

const svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach((term) => {
  svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

function each(list, f) {
  for (let i = 0; i < list.length; i++) {
    f(list[i], i);
  }
}

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
  return container.childNodes;
}

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

  addVirtualAttrs: function(el) {
    let virtual = el.tag === "div" ? "" : el.tag;

    if (el.attrs.class) {
      let attrs = el.attrs.class.replace(/\s+/g, ".");
      virtual += `.${attrs}`;
      el.attrs.class = undefined;
    }

    each(Object.keys(el.attrs).sort(), function(attrName) {
      if (attrName === "style") return;
      if (el.attrs[attrName] === undefined) return;
      let attrs = el.attrs[attrName];
      attrs = attrs.replace(/[\n\r\t]/g, " ");
      attrs = attrs.replace(/\s+/g, " "); // clean up redundant spaces we just created
      attrs = attrs.replace(/'/g, "\\'"); // escape quotes
      virtual += `[${attrName}='${attrs}']`;
    });

    if (virtual === "") virtual = "div";
    virtual = `"${virtual}"`; // add quotes

    if (el.attrs.style) {
      let attrs = el.attrs.style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon
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

    const children = (el.children.length !== 0) ?
      new TemplateBuilder(el.children).complete() :
      null;

    this.children.push({
      node: virtual,
      children
    });
  },

  complete: function() {
    each(this.virtual, function(el) {
      if (typeof el === "string") {
        const trimmed = el.trim();
        const charCode = trimmed.charCodeAt();
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
        this.addVirtualAttrs(el);
      }
    }.bind(this));
    return this.children;
  }
};

const whitespace = (level, indent) => {
  if (level < 0) return "";
  let whitespace = "";
  for (var i = 0; i < level; i++) {
    whitespace += indent;
  }
  return whitespace;
};

const wrapperTemplate = content => (
  `[${content}\n]`
);

const contentTemplate = (content, whitespace) => (
  `\n${whitespace}${content}`
);

const singleMithrilNodeTemplate = (mithrilNode, children, whitespace) => (
  `\n${whitespace}m(${mithrilNode})`
);

const mithrilNodeMultipleChildrenTemplate = (mithrilNode, children, whitespace, indent) => (
  `\n${whitespace}m(${mithrilNode},
${whitespace}${indent}[${children}
${whitespace}${indent}]
${whitespace})`
);

const mithrilNodeSingleChildTemplate = (mithrilNode, child, whitespace) => (
  `\n${whitespace}m(${mithrilNode}, ${child}
${whitespace})`
);

const template = (mithrilNode, children, whitespace, indent) => (
  children
    ? children.length > 1
      ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent)
      : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace, indent)
    : singleMithrilNodeTemplate(mithrilNode, children, whitespace, indent)
);

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

/*
opts: {
  source: string containing HTML markup
  indent: either "2", "4" or "tab"
}
*/
export const templateBuilder = opts => {
  const source = createVirtual(createFragment(opts.source));
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
