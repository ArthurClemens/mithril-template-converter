/* global describe, it, expect, window */

const templateBuilder = window.mithrilTemplateBuilder.templateBuilder;

describe("Template Builder", function () {
  describe("Single tags", function () {

    it("Unclosed single tag", function () {
      var input = "<p>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("p")
`.trim());
    });

    it("Self-closing single tag", function () {
      var input = "<hr/>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("hr")
`.trim());
    });

  });

  describe("Multiple tags", function () {

    it("Multiple spans", function () {
      var input = "<span>One</span> <span>Two</span> <span>Three</span>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
[
    m("span", 
        "One"
    ), 
    m("span", 
        "Two"
    ), 
    m("span", 
        "Three"
    )
]`.trim());
    });
  });

  describe("Text content", function () {

    it("Text content", function () {
      var input = "<h1>Title</h1>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("h1", 
    "Title"
)`.trim());
    });

    it("Text content single quotes", function () {
      var input = "<h1>Title</h1>";
      var output = templateBuilder({ source: input, indent: "4", quotes: "single" });
      expect(output).to.equal(`
m('h1', 
    'Title'
)`.trim());
    });

    it("Text content with spacing", function () {
      var input = "<h1>  Title  </h1>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("h1", 
    " Title "
)`.trim());
    });

    it("Text content with spacing around tag", function () {
      var input = "  <h1>Title</h1>  ";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("h1", 
    "Title"
)`.trim());
    });

  });

  describe("Nested tags", function () {

    it("Nested tag, 1 level", function () {
      var input = "<div><p>text</p></div>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("div", 
    m("p", 
        "text"
    )
)`.trim());
    });

    it("Nested tag, 2 levels", function () {
      var input = "<div><p><span>text</span></p></div>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("div", 
    m("p", 
        m("span", 
            "text"
        )
    )
)`.trim());
    });

    it("Multiple nested tag, 2 levels", function () {
      var input = "<div><p><span>text</span></p></div> <div><p><span>text</span></p></div>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
[
    m("div", 
        m("p", 
            m("span", 
                "text"
            )
        )
    ), 
    m("div", 
        m("p", 
            m("span", 
                "text"
            )
        )
    )
]`.trim());
    });
  });

  describe("Attributes", function () {

    it("href selectors", function () {
      var input = "<a href=\"http://mithril.js.org\">Mithril</a>";
      var output = templateBuilder({ source: input, indent: "4", attrs: "selectors" });
      expect(output).to.equal(`
m("a[href='http://mithril.js.org']", 
    "Mithril"
)`.trim());
    });

    it("href attributes", function () {
      var input = "<a href=\"http://mithril.js.org\">Mithril</a>";
      var output = templateBuilder({ source: input, indent: "4", attrs: "attributes" });
      expect(output).to.equal(`
m("a", {"href":"http://mithril.js.org"}, 
    "Mithril"
)`.trim());
    });

    it("href selectors single quotes", function () {
      var input = `
<a href="http://mithril.js.org">Mithril</a>
`;
      var output = templateBuilder({ source: input, indent: "4", attrs: "selectors", quotes: "single" });
      expect(output).to.equal(`
m('a[href="http://mithril.js.org"]', 
    'Mithril'
)`.trim());
    });

    it("Single style attribute", function () {
      var input = "<div style='color:#f00'>text</div>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("div", {"style":{"color":"#f00"}}, 
    "text"
)`.trim());
    });

    it("Multiple style attributes", function () {
      var input = "<div style='color:#f00; border: 1px solid red'>text</div>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
m("div", {"style":{"color":"#f00","border":"1px solid red"}}, 
    "text"
)`.trim());
    });

    it("Multiple other attributes", function () {
      var input = `
<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
`;
      var output = templateBuilder({ source: input, indent: "4", attrs: "selectors" });
      expect(output).to.equal(`
m("button.close[type='button'][data-dismiss='modal'][aria-label='Close']", 
    m("span[aria-hidden='true']", 
        m.trust("&times;")
    )
)`.trim());
    });

  });

  describe("Tables", function () {

    it("Table tags without closing nodes", function () {
      var input = "<table><tr><td>";
      var output = templateBuilder({ source: input, indent: "2" });
      expect(output).to.equal(`
m("table", 
  m("tbody", 
    m("tr", 
      m("td")
    )
  )
)`.trim());
    });

    it("Simple table with attributes", function () {
      var input = `
<table style="border: 1px solid black"><tr><td>Test</td></tr></table>
`;
      var output = templateBuilder({ source: input, indent: "2" });
      expect(output).to.equal(`
m("table", {"style":{"border":"1px solid black"}}, 
  m("tbody", 
    m("tr", 
      m("td", 
        "Test"
      )
    )
  )
)`.trim());
    });

    it("Table with thead and tfoot", function () {
      // Note the extra spacing around "weekday" text content
      var input = `
<table cellpadding=6 rules=groups frame=box> <thead> <tr> <th>  weekday  </th> <th>date</th> <th>manager</th> <th>qty</th> </tr> </thead> <tbody> <tr> <td>mon</td> <td>09/11</td> <td>kelsey</td> <td>639</td> </tr> <tr> <td>tue</td> <td>09/12</td> <td>lindsey</td> <td>596</td> </tr> <tr> <td>wed</td> <td>09/13</td> <td>randy</td> <td>1135</td> </tr> <tr> <td>thu</td> <td>09/14</td> <td>susan</td> <td>1002</td> </tr> <tr> <td>fri</td> <td>09/15</td> <td>randy</td> <td>908</td> </tr> <tr> <td>sat</td> <td>09/16</td> <td>lindsey</td> <td>371</td> </tr> <tr> <td>sun</td> <td>09/17</td> <td>susan</td> <td>272</td> </tr> </tbody> <tfoot> <tr> <th align=left colspan=3>total</th> <th>4923</th> </tr> </tfoot> </table>
`;
      var output = templateBuilder({ source: input, attributes: "selectors" });
      expect(output).to.equal(`
m("table", {"cellpadding":"6","rules":"groups","frame":"box"},
  [
    m("thead", 
      m("tr",
        [
          m("th", 
            " weekday "
          ),
          m("th", 
            "date"
          ),
          m("th", 
            "manager"
          ),
          m("th", 
            "qty"
          )
        ]
      )
    ),
    m("tbody",
      [
        m("tr",
          [
            m("td", 
              "mon"
            ),
            m("td", 
              "09/11"
            ),
            m("td", 
              "kelsey"
            ),
            m("td", 
              "639"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "tue"
            ),
            m("td", 
              "09/12"
            ),
            m("td", 
              "lindsey"
            ),
            m("td", 
              "596"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "wed"
            ),
            m("td", 
              "09/13"
            ),
            m("td", 
              "randy"
            ),
            m("td", 
              "1135"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "thu"
            ),
            m("td", 
              "09/14"
            ),
            m("td", 
              "susan"
            ),
            m("td", 
              "1002"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "fri"
            ),
            m("td", 
              "09/15"
            ),
            m("td", 
              "randy"
            ),
            m("td", 
              "908"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "sat"
            ),
            m("td", 
              "09/16"
            ),
            m("td", 
              "lindsey"
            ),
            m("td", 
              "371"
            )
          ]
        ),
        m("tr",
          [
            m("td", 
              "sun"
            ),
            m("td", 
              "09/17"
            ),
            m("td", 
              "susan"
            ),
            m("td", 
              "272"
            )
          ]
        )
      ]
    ),
    m("tfoot", 
      m("tr",
        [
          m("th", {"align":"left","colspan":"3"}, 
            "total"
          ),
          m("th", 
            "4923"
          )
        ]
      )
    )
  ]
)`.trim());
    });
  });

  describe("Images", function () {

    it("Image with attributes", function () {
      var input = `
<img src="https://raw.githubusercontent.com/ArthurClemens/assets/gh-pages/polythene/examples/avatar-1.png" alt="Movie star" style="width:128px;height:128px;">
`;
      var output = templateBuilder({ source: input });
      expect(output).to.equal(`
m("img", {"src":"https://raw.githubusercontent.com/ArthurClemens/assets/gh-pages/polythene/examples/avatar-1.png","alt":"Movie star","style":{"width":"128px","height":"128px"}})
`.trim());
    });
  });

  describe("SVGs", function () {

    it("Simple svg", function () {
      var input =
        `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
<path d="M12,2c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M21,9h-6v13h-2v-6h-2v6H9V9H3V7h18V9z"/>
</svg>`;
      var output = templateBuilder({ source: input, attributes: "selectors" });
      expect(output).to.equal(`
m("svg", {"version":"1.1","id":"Layer_1","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","x":"0px","y":"0px","viewBox":"0 0 24 24","xml:space":"preserve","style":{"enable-background":"new 0 0 24 24"}}, 
  m("path", {"d":"M12,2c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M21,9h-6v13h-2v-6h-2v6H9V9H3V7h18V9z"})
)
`.trim());
    });

    it("Case-sensitive SVG", function () {
      var input =
        `<svg version="1.1" x="0" y="0" width="360" height="420">
  <path id="guideTextPath" d="M180,312 A132,132 0 0 0 272.34,272.34" fill="none"></path>
  <text font-size="14pt">
    <textPath href="#guideTextPath" startoffset="50%" alignment-baseline="central">GUIDE</textPath>
  </text>
</svg>`;
      var output = templateBuilder({ source: input });
      expect(output).to.equal(`
m("svg", {"version":"1.1","x":"0","y":"0","width":"360","height":"420"},
  [
    m("path", {"id":"guideTextPath","d":"M180,312 A132,132 0 0 0 272.34,272.34","fill":"none"}),
    m("text", {"font-size":"14pt"}, 
      m("textPath", {"href":"#guideTextPath","startOffset":"50%","alignment-baseline":"central"}, 
        "GUIDE"
      )
    )
  ]
)
`.trim());
    });

    it("Complex svg", function () {
      var input =
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   version="1.1"
   x="0px"
   y="0px"
   viewBox="0 0 40 32"
   id="svg2"
   inkscape:version="0.91 r13725"
   sodipodi:docname="xcloud.svg"
   width="40"
   height="32">
  <metadata
     id="metadata12">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id="defs10" />
  <sodipodi:namedview
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1"
     objecttolerance="10"
     gridtolerance="10"
     guidetolerance="10"
     inkscape:pageopacity="0"
     inkscape:pageshadow="2"
     inkscape:window-width="1881"
     inkscape:window-height="745"
     id="namedview8"
     showgrid="false"
     inkscape:zoom="3.337544"
     inkscape:cx="19.402957"
     inkscape:cy="15.753357"
     inkscape:window-x="138"
     inkscape:window-y="427"
     inkscape:window-maximized="0"
     inkscape:current-layer="g4" />
  <g
     transform="matrix(0.44,0,0,0.44,-2.5613949,-423.68403)"
     id="g4"
     style="fill:#ff0000">
    <path
       style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:Sans;-inkscape-font-specification:Sans;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;letter-spacing:normal;word-spacing:normal;text-transform:none;direction:ltr;block-progression:tb;writing-mode:lr-tb;baseline-shift:baseline;text-anchor:start;display:inline;overflow:visible;visibility:visible;opacity:1;fill:#ff0000;fill-opacity:1;stroke:none;stroke-width:2;marker:none;enable-background:accumulate"
       d="m 45.042874,969.00026 c -12.989722,0 -22.060344,11.55001 -21.03125,23.125 -8.363515,0.57321 -14.9687499,7.792 -14.9687499,15.87504 0,9.8523 7.5387799,17 15.9999999,17 l 12,0 c 0.528313,0.01 1.014242,-0.4717 1.014242,-1 0,-0.5284 -0.485929,-1.0075 -1.014242,-1 l -12,0 c -7.3381,0 -14,-6.1607 -14,-15 0,-7.2801 6.291083,-14.00004 14,-14.00004 0.579956,0.007 1.090601,-0.58337 1,-1.15625 -1.50281,-10.70142 6.856644,-21.84375 19,-21.84375 8.157628,0 14.250867,4.75171 17.09375,10.4375 0.23759,0.46603 0.877329,0.67432 1.34375,0.4375 3.686951,-1.84348 8.103936,-1.60639 11.5625,0.46875 3.458564,2.07514 6,5.96181 6,11.65625 0.0089,0.46494 0.384434,0.89614 0.84375,0.96875 6.551424,1.09924 11.156248,7.53519 11.156248,14.03129 0,7.783 -6.268459,14 -15.999998,14 l -10,0 c -0.528313,-0.01 -1.014242,0.4716 -1.014242,1 0,0.5283 0.485929,1.0074 1.014242,1 l 10,0 c 10.606145,0 17.999998,-7.1236 17.999998,-16 0,-7.1804 -4.88297,-14.15421 -12.093748,-15.78129 -0.245947,-5.88289 -3.043944,-10.27637 -6.90625,-12.59375 -3.787467,-2.27248 -8.46508,-2.54887 -12.59375,-0.8125 -3.310103,-5.96808 -9.830947,-10.8125 -18.40625,-10.8125 z m -1.125,45.96874 c -0.757272,0.074 -1.144058,1.1934 -0.59375,1.7188 l 7.28125,7.3125 -7.28125,7.2812 c -0.371761,0.3756 -0.366283,1.0566 0.01147,1.4261 0.18564,0.1816 0.452139,0.2927 0.70728,0.2927 0.266717,0 0.531946,-0.1193 0.71875,-0.3125 l 7.28125,-7.2813 7.28125,7.2813 c 0.190785,0.1927 0.457502,0.312 0.71875,0.3125 0.253696,4e-4 0.517925,-0.124 0.698995,-0.3011 0.37493,-0.3668 0.384322,-1.0406 0.01976,-1.4177 l -7.281255,-7.2812 7.28125,-7.3125 c 0.583613,-0.5623 0.05912,-1.7643 -0.75,-1.7188 -0.257929,0.01 -0.510228,0.1249 -0.6875,0.3125 l -7.28125,7.2813 -7.28125,-7.2813 c -0.211936,-0.2277 -0.534609,-0.3472 -0.84375,-0.3125 z"
       id="path6"
       inkscape:connector-curvature="0" />
  </g>
</svg>`;
      var output = templateBuilder({ source: input });
      expect(output).to.equal(`
m("svg", {"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg","xmlns":"http://www.w3.org/2000/svg","xmlns:sodipodi":"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd","xmlns:inkscape":"http://www.inkscape.org/namespaces/inkscape","version":"1.1","x":"0px","y":"0px","viewBox":"0 0 40 32","id":"svg2","inkscape:version":"0.91 r13725","sodipodi:docname":"xcloud.svg","width":"40","height":"32"},
  [
    m("metadata", {"id":"metadata12"}, 
      m("rdf:rdf", 
        m("cc:work", {"rdf:about":""},
          [
            m("dc:format", 
              "image/svg+xml"
            ),
            m("dc:type", {"rdf:resource":"http://purl.org/dc/dcmitype/StillImage"}),
            m("dc:title")
          ]
        )
      )
    ),
    m("defs", {"id":"defs10"}),
    m("sodipodi:namedview", {"pagecolor":"#ffffff","bordercolor":"#666666","borderopacity":"1","objecttolerance":"10","gridtolerance":"10","guidetolerance":"10","inkscape:pageopacity":"0","inkscape:pageshadow":"2","inkscape:window-width":"1881","inkscape:window-height":"745","id":"namedview8","showgrid":"false","inkscape:zoom":"3.337544","inkscape:cx":"19.402957","inkscape:cy":"15.753357","inkscape:window-x":"138","inkscape:window-y":"427","inkscape:window-maximized":"0","inkscape:current-layer":"g4"}),
    m("g", {"transform":"matrix(0.44,0,0,0.44,-2.5613949,-423.68403)","id":"g4","style":{"fill":"#ff0000"}}, 
      m("path", {"d":"m 45.042874,969.00026 c -12.989722,0 -22.060344,11.55001 -21.03125,23.125 -8.363515,0.57321 -14.9687499,7.792 -14.9687499,15.87504 0,9.8523 7.5387799,17 15.9999999,17 l 12,0 c 0.528313,0.01 1.014242,-0.4717 1.014242,-1 0,-0.5284 -0.485929,-1.0075 -1.014242,-1 l -12,0 c -7.3381,0 -14,-6.1607 -14,-15 0,-7.2801 6.291083,-14.00004 14,-14.00004 0.579956,0.007 1.090601,-0.58337 1,-1.15625 -1.50281,-10.70142 6.856644,-21.84375 19,-21.84375 8.157628,0 14.250867,4.75171 17.09375,10.4375 0.23759,0.46603 0.877329,0.67432 1.34375,0.4375 3.686951,-1.84348 8.103936,-1.60639 11.5625,0.46875 3.458564,2.07514 6,5.96181 6,11.65625 0.0089,0.46494 0.384434,0.89614 0.84375,0.96875 6.551424,1.09924 11.156248,7.53519 11.156248,14.03129 0,7.783 -6.268459,14 -15.999998,14 l -10,0 c -0.528313,-0.01 -1.014242,0.4716 -1.014242,1 0,0.5283 0.485929,1.0074 1.014242,1 l 10,0 c 10.606145,0 17.999998,-7.1236 17.999998,-16 0,-7.1804 -4.88297,-14.15421 -12.093748,-15.78129 -0.245947,-5.88289 -3.043944,-10.27637 -6.90625,-12.59375 -3.787467,-2.27248 -8.46508,-2.54887 -12.59375,-0.8125 -3.310103,-5.96808 -9.830947,-10.8125 -18.40625,-10.8125 z m -1.125,45.96874 c -0.757272,0.074 -1.144058,1.1934 -0.59375,1.7188 l 7.28125,7.3125 -7.28125,7.2812 c -0.371761,0.3756 -0.366283,1.0566 0.01147,1.4261 0.18564,0.1816 0.452139,0.2927 0.70728,0.2927 0.266717,0 0.531946,-0.1193 0.71875,-0.3125 l 7.28125,-7.2813 7.28125,7.2813 c 0.190785,0.1927 0.457502,0.312 0.71875,0.3125 0.253696,4e-4 0.517925,-0.124 0.698995,-0.3011 0.37493,-0.3668 0.384322,-1.0406 0.01976,-1.4177 l -7.281255,-7.2812 7.28125,-7.3125 c 0.583613,-0.5623 0.05912,-1.7643 -0.75,-1.7188 -0.257929,0.01 -0.510228,0.1249 -0.6875,0.3125 l -7.28125,7.2813 -7.28125,-7.2813 c -0.211936,-0.2277 -0.534609,-0.3472 -0.84375,-0.3125 z","id":"path6","inkscape:connector-curvature":"0","style":{"color":"#000000","font-style":"normal","font-variant":"normal","font-weight":"normal","font-stretch":"normal","font-size":"medium","line-height":"normal","font-family":"Sans","-inkscape-font-specification":"Sans","text-indent":"0","text-align":"start","text-decoration":"none","text-decoration-line":"none","letter-spacing":"normal","word-spacing":"normal","text-transform":"none","direction":"ltr","block-progression":"tb","writing-mode":"lr-tb","baseline-shift":"baseline","text-anchor":"start","display":"inline","overflow":"visible","visibility":"visible","opacity":"1","fill":"#ff0000","fill-opacity":"1","stroke":"none","stroke-width":"2","marker":"none","enable-background":"accumulate"}})
    )
  ]
)
`.trim());
    });
  });

  describe("Complete examples", function () {

    it("Bootstrap dialog", function () {
      var input = `<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
        <p>One fine body&hellip;</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->`;
      var output = templateBuilder({ source: input });
      expect(output).to.equal(`
m("div", {"class":"modal fade","tabindex":"-1","role":"dialog"}, 
  m("div", {"class":"modal-dialog"}, 
    m("div", {"class":"modal-content"},
      [
        m("div", {"class":"modal-header"},
          [
            m("button", {"class":"close","type":"button","data-dismiss":"modal","aria-label":"Close"}, 
              m("span", {"aria-hidden":"true"}, 
                m.trust("&times;")
              )
            ),
            m("h4", {"class":"modal-title"}, 
              "Modal title"
            )
          ]
        ),
        m("div", {"class":"modal-body"}, 
          m("p",
            [
              "One fine body",
              m.trust("&hellip;")
            ]
          )
        ),
        m("div", {"class":"modal-footer"},
          [
            m("button", {"class":"btn btn-default","type":"button","data-dismiss":"modal"}, 
              "Close"
            ),
            m("button", {"class":"btn btn-primary","type":"button"}, 
              "Save changes"
            )
          ]
        )
      ]
    )
  )
)
`.trim());
    });
  });

  describe("Outpur indent levels", function () {

    it("Indent: 2 spaces", function () {
      var input = "<span>One</span> <span>Two</span> <span>Three</span>";
      var output = templateBuilder({ source: input, indent: "2" });
      expect(output).to.equal(`
[
  m("span", 
    "One"
  ), 
  m("span", 
    "Two"
  ), 
  m("span", 
    "Three"
  )
]`.trim());
    });

    it("Indent: 4 spaces", function () {
      var input = "<span>One</span> <span>Two</span> <span>Three</span>";
      var output = templateBuilder({ source: input, indent: "4" });
      expect(output).to.equal(`
[
    m("span", 
        "One"
    ), 
    m("span", 
        "Two"
    ), 
    m("span", 
        "Three"
    )
]`.trim());
    });

    it("Indent: tab", function () {
      var input = "<span>One</span> <span>Two</span> <span>Three</span>";
      var output = templateBuilder({ source: input, indent: "tab" });
      expect(output).to.equal(`
[
	m("span", 
		"One"
	), 
	m("span", 
		"Two"
	), 
	m("span", 
		"Three"
	)
]`.trim());
    });
  });

});
