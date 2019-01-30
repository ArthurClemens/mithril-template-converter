
const examples = [
  // Style
  `<!-- Style -->

<div style="padding: .75rem 1.25rem; border: 1px solid #f5c6cb; border-radius: .25rem; color: #721c24; background-color: #f8d7da;">Warning</div>`,

  // Simple divs
  `<!-- Simple divs -->

<div><p><span>text</span></p></div> <div><p><span>text</span></p></div>`,

  // Bootstrap button group
  `<!-- Bootstrap button group -->

<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <label class="btn btn-secondary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
  </label>
  <label class="btn btn-secondary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Radio
  </label>
  <label class="btn btn-secondary">
    <input type="radio" name="options" id="option3" autocomplete="off"> Radio
  </label>
</div>

<style>
  @import 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'
</style>`,

  // Fomantic UI Table
  `<!-- Fomantic UI Table -->

<table class="ui selectable celled table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John</td>
      <td>No Action</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Jamie</td>
      <td>Approved</td>
      <td>Requires call</td>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Denied</td>
      <td>None</td>
    </tr>
    <tr class="warning">
      <td>John</td>
      <td>No Action</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Jamie</td>
      <td class="positive">Approved</td>
      <td class="warning">Requires call</td>
    </tr>
    <tr>
      <td>Jill</td>
      <td class="negative">Denied</td>
      <td>None</td>
    </tr>
  </tbody>
</table>

<style>
  @import 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.7.1/dist/semantic.css'
</style>`,

  // Image
  `<!-- Image -->

<img src="https://raw.githubusercontent.com/ArthurClemens/assets/gh-pages/polythene/examples/avatar-1.png" alt="Movie star" style="width:128px;height:128px;border-radius:50%;" />`,

  // HTML entities
  `<!-- HTML entities -->

<h1>&#9730;&#9728;&#9729;&#9757;😀</h1>`,

  // SVG
  `<!-- SVG -->

<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" viewBox="0 0 240 240" height="240" width="240"><path id="path4" d="m 160,60 0,115 c 0,22.1 -17.9,40 -40,40 -22.1,0 -40,-17.9 -40,-40 L 80,50 c 0,-13.8 11.2,-25 25,-25 13.8,0 25,11.2 25,25 l 0,105 c 0,5.5 -4.5,10 -10,10 -5.5,0 -10,-4.5 -10,-10 l 0,-95 -15,0 0,95 c 0,13.8 11.2,25 25,25 13.8,0 25,-11.2 25,-25 L 145,50 C 145,27.9 127.1,10 105,10 82.9,10 65,27.9 65,50 l 0,125 c 0,30.4 24.6,55 55,55 30.4,0 55,-24.6 55,-55 l 0,-115 -15,0 z" /></svg>`,

  // Material Design Web: List
  `<!-- Material Design Web: List -->

<ul class="mdc-list" style="background:#fff">
  <li class="mdc-list-item">Line item 1</li>
  <li class="mdc-list-item">Line item 2</li>
  <li class="mdc-list-item">Line item 3</li>
</ul>

<style>
  @import 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css'
</style>`,

  // ui-kit Card
  `<!-- UIKit Card -->

<div class="uk-card uk-card-default">
  <div class="uk-card-header">
    <div class="uk-grid-small uk-flex-middle uk-grid" uk-grid="">
      <div class="uk-width-auto uk-first-column">
        <img class="uk-border-circle" width="40" height="40" src="https://getuikit.com/docs/images/avatar.jpg">
      </div>
      <div class="uk-width-expand">
        <h3 class="uk-card-title uk-margin-remove-bottom">Title</h3>
        <p class="uk-text-meta uk-margin-remove-top"><time datetime="2016-04-01T19:00">April 01, 2016</time></p>
      </div>
    </div>
  </div>
  <div class="uk-card-body">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
  </div>
  <div class="uk-card-footer">
    <a href="#" class="uk-button uk-button-text">Read more</a>
  </div>
</div>

<style>
  @import 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.css'
</style>`,
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
