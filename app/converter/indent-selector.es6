import m from "mithril";
import menu from "polythene/menu/menu";
import button from "polythene/button/button";
import list from "polythene/list/list";
import listTile from "polythene/list-tile/list-tile";

const STORAGE_KEY = "mithril-template-converter__indent-index"

const storageAvailable = (type) => {
    try {
        var storage = window[type],
            x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

const settings = {};
settings.controller = (opts) => {
    let defaultIndex = storageAvailable("localStorage") ? localStorage.getItem(STORAGE_KEY) : 2
    if (defaultIndex === null) {
        defaultIndex = 2
    } else {
        defaultIndex = Math.max(0, Math.min(2, defaultIndex))
    }

    const options = [
        {
            title: "2 Spaces",
            id: "2"
        },
        {
            title: "4 Spaces",
            id: "4"
        },
        {
            title: "Tab",
            id: "tab"
        }
    ];

    const setSelectedIndex = (index) => {
        menu.selectedIndex = index,
        localStorage.setItem(STORAGE_KEY, index)
        opts.indentId(options[index].id)
    }

    const menu = {
        show: false,
        selectedIndex: defaultIndex,
        options,
        setSelectedIndex
    };

    setSelectedIndex(defaultIndex)

    return {
        menu,
        setSelectedIndex
    };
};
settings.view = (ctrl) => {
    return m(".indent-selector", [
        m.component(menu, {
            target: "indent-selections",
            show: ctrl.menu.show,
            hideDelay: .240,
            didHide: () => {
                ctrl.menu.show = false;
            },
            size: 5,
            offset: 0,
            content: m.component(list, {
                hoverable: true,
                tiles: ctrl.menu.options.map((setting, index) => {
                    return m.component(listTile, {
                        title: setting.title,
                        selected: index === ctrl.menu.selectedIndex,
                        ink: true,
                        events: {
                            onclick: () => (
                                ctrl.setSelectedIndex(index)
                            )
                        }
                    });
                })
            })
        }),
        m.component(button, {
            id: "indent-selections",
            label: "Indent: " + ctrl.menu.options[ctrl.menu.selectedIndex].title,
            events: {
                onclick: () => {
                    ctrl.menu.show = true;
                }
            }
        })
    ]);
};

export default settings;
