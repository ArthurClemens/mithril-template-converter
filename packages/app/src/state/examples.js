import { S } from "patchinko/explicit";

const exampleData = [
  // Style
  `<!-- Style -->

<div style="padding: .75rem 1.25rem; border: 1px solid #f5c6cb; border-radius: .25rem; color: #721c24; background-color: #f8d7da;">Warning</div>`,

  // Simple divs
  `<!-- Simple divs -->

<div><p><span>text</span></p></div> <div><p><span>text</span></p></div>`,

  // Form elements
  `<!-- Form elements -->

<form>
  <p>
    <input readonly class="textfield" type=text value="Company" />
  </p>
  <p>
    <input required class="textfield" type=text name="name" placeholder="Your name" value="" />
  </p>
  <p>
    <button type="submit" disabled>Send</button>
  </p>
</form>`,

  // Tailwind Form
  `<!-- Tailwind Form -->

<form class="w-full" style="background:#fff; padding:20px;">
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="block text-grey font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
        Full Name
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple" id="inline-full-name" type="text" value="Jane Doe">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="block text-grey font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
        Password
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple" id="inline-username" type="password" placeholder="******************">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3"></div>
    <label class="md:w-2/3 block text-grey font-bold">
      <input class="mr-2 leading-tight" type="checkbox">
      <span class="text-sm">
        Send me your newsletter!
      </span>
    </label>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="shadow bg-purple hover:bg-purple-light focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
        Sign Up
      </button>
    </div>
  </div>
</form>

<style>
  @import "https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"
</style>`,


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
  @import "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
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
  @import "https://cdn.jsdelivr.net/npm/fomantic-ui@2.7.1/dist/semantic.css"
</style>`,

  // Image
  `<!-- Image -->

<img src="https://raw.githubusercontent.com/ArthurClemens/assets/gh-pages/polythene/examples/avatar-1.png" alt="Movie star" style="width:128px;height:128px;border-radius:50%;" />`,

  // HTML entities
  `<!-- HTML entities -->

<h1>&#9730;&#9728;&#9729;&#9757;😀</h1>`,

  // SVG
  `<!-- SVG -->

<svg viewBox="0 0 100 100">
  <clipPath id="myClip">
    <!--
      Everything outside the circle will be
      clipped and therefore invisible.
    -->
    <circle cx="40" cy="35" r="35" />
  </clipPath>
 
  <!-- The original black heart for reference -->
  <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
 
  <!--
    Only the portion of the red heart
    inside the clip circle is visible.
  -->
  <use clip-path="url(#myClip)" xlink:href="#heart" fill="red" />
</svg>

<style>
@keyframes openYourHeart {from {r: 0} to {r: 60px}}
#myClip circle {
  animation: openYourHeart 15s infinite;
}
</style>`,

  // Material Design Web: List
  `<!-- Material Design Web: List -->

<ul class="mdc-list" style="background:#fff">
  <li class="mdc-list-item">Line item 1</li>
  <li class="mdc-list-item">Line item 2</li>
  <li class="mdc-list-item">Line item 3</li>
</ul>

<style>
  @import "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
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
  @import "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.css"
</style>`,
];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const data = shuffle(exampleData);

export const examples = {
  initialState: {
    example: {
      index: 0,
      code: data[0]
    }
  },
  actions: update => {
    return {
      nextExample: () => {
        update({
          example: S(example => {
            const nextIndex = (example.index + 1) % data.length;
            return {
              index: nextIndex,
              code: data[nextIndex]
            };
          })
        });
      },
    };
  }
};
