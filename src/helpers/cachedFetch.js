import 'dotenv/config';

import fetch from 'node-fetch';
import path from 'path';
import flatcache from 'flat-cache';

//  Basing off the ideas found here:
//  https://www.npmjs.com/package/flat-cache
//  https://scotch.io/tutorials/how-to-optimize-node-requests-with-simple-caching-strategies
//  https://www.sitepoint.com/cache-fetched-ajax-requests/
//  https://stackabuse.com/reading-and-writing-json-files-with-node-js -- potentiallu replaces flat-cache?



const cachedFetch = (url, options) => {
    let cacheKey = url;
    let cached = flatcache.load('zkswapCache', path.resolve('./tmp/cache'))
    let cachedContent = cached.getKey(cacheKey);
    if(cachedContent) {
        //  Already cached
        let response = new Response(new Blob([cachedContent]));
        return Promise.resolve(response);
    }

    //  Cache doesnt exist, make request

    return fetch(url, options).then(resp => {
        // let's only store in cache if the content-type is
        // JSON or something non-binary
        if(resp.status === 200) {
            let ct = resp.headers.get('Content-Type')
            if(ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
                resp.clone().text().then(content => {
                    cached.setKey(cacheKey, content)
                })
            }
        }
        return resp;
    })

}

export default { cachedFetch }