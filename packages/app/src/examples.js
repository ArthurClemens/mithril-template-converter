
const examples = [
  // h2
  `<!-- Ruler -->
<hr />`,

  // 2 divs
  `<!-- 2 divs -->
<div><p><span>text</span></p></div> <div><p><span>text</span></p></div>`,

  // Bootstrap dialog
  `<!-- Bootstrap dialog -->
<div class="modal fade" tabindex="-1" role="dialog">
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
</div><!-- /.modal -->`,

  // Bootstrap button
  `<!-- Bootstrap button -->
<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`,

  // Table
  `<!-- Table -->
<table cellpadding=6 rules=groups frame=box> <thead> <tr> <th>  weekday  </th> <th>date</th> <th>manager</th> <th>qty</th> </tr> </thead> <tbody> <tr> <td>mon</td> <td>09/11</td> <td>kelsey</td> <td>639</td> </tr> <tr> <td>tue</td> <td>09/12</td> <td>lindsey</td> <td>596</td> </tr> <tr> <td>wed</td> <td>09/13</td> <td>randy</td> <td>1135</td> </tr> <tr> <td>thu</td> <td>09/14</td> <td>susan</td> <td>1002</td> </tr> <tr> <td>fri</td> <td>09/15</td> <td>randy</td> <td>908</td> </tr> <tr> <td>sat</td> <td>09/16</td> <td>lindsey</td> <td>371</td> </tr> <tr> <td>sun</td> <td>09/17</td> <td>susan</td> <td>272</td> </tr> </tbody> <tfoot> <tr> <th align=left colspan=3>total</th> <th>4923</th> </tr> </tfoot> </table>`,

  // Image
  `<!-- Image -->
<img src="https://raw.githubusercontent.com/ArthurClemens/assets/gh-pages/polythene/examples/avatar-1.png" alt="Movie star" style="width:128px;height:128px;">`,

  // HTML entities
  `<!-- HTML entities -->
<h1>&#169;&#174;&#182;&#167;&hellip;</h1>`,

  // SVG
  `<!-- SVG -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`,

  // Material Design Web: List
  `<!-- Material Design Web: List -->
<ul class="mdc-list mdc-list--two-line" aria-orientation="vertical">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
</ul>` 
];

const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export default shuffle(examples);
