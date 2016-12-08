import xhr from 'xhr';
import { onMessage } from './messaging';

onMessage('bdgg_xhr', options => {
    return new Promise((resolve, reject) => {
        xhr(options, (err, resp, body) => {
            if (!!err) {
                reject(err);
            } else if (resp.statusCode !== 200) {
                reject(resp);
            } else {
                resolve(body);
            }
        });
    });
});
