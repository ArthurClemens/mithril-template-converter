import m from "mithril";
import { Menu, Button, List, ListTile } from "polythene-mithril";

const STORAGE_KEY = "mithril-template-converter__indent-index";

const storageAvailable = type => {
  try {
    var storage = window[type],
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

const menuOptions = [
  {
    title: "2 Spaces",
    id: "2"
  },
  {
    title: "4 Spaces",
    id: "4",
    default: true
  },
  {
    title: "Tab",
    id: "tab"
  }
];
const defaultMenuIndex = 0;

const Settings = {
  oninit: vnode => {
    const indentId = vnode.attrs.indentId;

    let defaultIndex = storageAvailable("localStorage")
      ? localStorage.getItem(STORAGE_KEY)
      : defaultMenuIndex;
    if (defaultIndex === null) {
      defaultIndex = defaultMenuIndex;
    } else {
      defaultIndex = Math.max(0, Math.min(defaultMenuIndex, defaultIndex));
    }    
    const setSelectedIndex = index => {
      vnode.state.menu.selectedIndex = index;
      localStorage.setItem(STORAGE_KEY, index);
      indentId(menuOptions[index].id);
    };
    
    vnode.state.menu = {
      isVisible: false,
      selectedIndex: defaultIndex,
      setSelectedIndex
    };

    setSelectedIndex(defaultMenuIndex);
  },
  view: vnode => {
    const menu = vnode.state.menu;
    return m(".indent-selector", [
      m(Menu, {
        target: "#indent-selections",
        reposition: true,
        show: menu.isVisible,
        hideDelay: .140,
        didHide: () => menu.isVisible = false,
        width: 5,
        offsetH: 0,
        content: m(List, {
          tiles: menuOptions.map((setting, index) =>
            m(ListTile, {
              className: index === menu.selectedIndex ? "selected": "",
              hoverable: true,
              title: setting.title,
              selected: index === menu.selectedIndex,
              ink: true,
              events: {
                onclick: () => menu.setSelectedIndex(index)
              }
            })
          )
        })
      }),
      m(Button, {
        dropdown: true,
        contained: true,
        id: "indent-selections",
        label: "Indent: " + menuOptions[menu.selectedIndex].title,
        events: {
          onclick: () => menu.isVisible = true
        }
      })
    ]);
  }
};

export default Settings;
