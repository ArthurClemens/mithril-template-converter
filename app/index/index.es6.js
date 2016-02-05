import m from 'mithril';
import button from 'polythene/button/button';
import converter from 'app/converter/converter';
import 'polythene/theme/theme';

const app = {};
app.view = function() {
    return m('div', [
        m('h1', 'Mithril HTML to JavaScript converter'),
        m.component(converter),
        m('p.source', [
            m('span', 'Built with '),
            m('a', {
                href: 'https://github.com/ArthurClemens/Polythene'
            }, 'Polythene'),
            m('span', ' for '),
            m('a', {
                href: 'https://github.com/lhorie/mithril.js'
            }, 'Mithril'),
            m('span', '.')
        ])
    ]);
};

m.mount(document.body, app);
