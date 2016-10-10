import jade from 'jade/lib/runtime';

let req = require.context('../templates', false, /\.jade$/);
req.keys().forEach(m => {
    let name = m.substring(m.lastIndexOf('/') + 1, m.length - 5);
    exports[name] = req(m);
});
