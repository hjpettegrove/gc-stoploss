//  Basing off the ideas found here:
//  https://www.npmjs.com/package/flat-cache
//  https://scotch.io/tutorials/how-to-optimize-node-requests-with-simple-caching-strategies
//  https://www.sitepoint.com/cache-fetched-ajax-requests/
//  https://stackabuse.com/reading-and-writing-json-files-with-node-js -- potentiallu replaces flat-cache?

import fetch from 'node-fetch';
import path from 'path';
import flatcache from 'flat-cache';


const cachedFetch = (url, options) => {
    let cacheKey = url;
    let cache = flatcache.load('cacheId')
    let cachedContent = cache.getKey(cacheKey)
    if(cachedContent != null)
    {
        console.log(`cache found for key ${cacheKey}`)
        let response = new Response(new Blob([cachedContent]))
        return Promise.resolve(response)
    }

    return fetch(url, options).then(response => {
        //  Only cache non binary content
        if(response.status === 200)
        {
            console.log(`positive response status 200`)
            let ctx = response.headers.get('Content-Type')
            console.log(ctx)
            if(ctx && (ctx.match(/application\/json/i) || ctx.match(/text\//i)))
            {
                console.log('content type was text or json')
                response.clone().text().then(content => {
                    console.log(content)
                    cache.setKey(cacheKey, content)
                })
            }
        }
        return response
    })
}

export default cachedFetch