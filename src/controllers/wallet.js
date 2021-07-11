
import zksEpnt from '../services/zksync-endpoints.js';

import fetch from 'node-fetch';
import cachedFetch from '../helpers/cachedFetch.js';

const test_balance = async (req, res) => {
    let networkId = Number.parseInt(req.params.network,10);
    let walletAddress = req.params.address.toString();

    const list_params = [{name: ":network", value: networkId}];
    const wallet_params = list_params.concat({name: ":address", value: walletAddress})

    let url = zksEpnt.getEndpoint(zksEpnt.endpoints["account-balance"].path,  wallet_params);
    let tokens_url = zksEpnt.getEndpoint(zksEpnt.endpoints["token-list"].path, list_params);
    let pairs_url = zksEpnt.getEndpoint(zksEpnt.endpoints["pair-list"].path, list_params);

    let [account_data, token_data, pair_data] = await Promise.all([(await cachedFetch(url)).json(), (await cachedFetch(tokens_url)).json(), (await cachedFetch(pairs_url)).json()])

    let wallet_balance = {
        asset: {
            tokens: account_data.data.asset.tokens,
            pairs: account_data.data.asset.pairs,
            total: account_data.data.asset.total
        }
    }

    wallet_balance.balances = {tokens: [], pairs: []}
    const count = account_data.data.balances.tokens.length;
    for(let i = 0; i < count; i++)
    {
        const id = account_data.data.balances.tokens[i].id;
        //console.log(id)
        /**       NOTE!!!! 
         *  IMPORTANT JS ISSUE I HAD
         *  
         *  converting the find into function ends up returning undefined with how i wrote it
         *  I feel it's a an async issue but that just seems like the answer for my trouble with async programming in general
         *  
         */
        const token = token_data.data.find((t)=> { if(t.id === id) return t;}); 
        //console.log(token)
        const amount = account_data.data.balances.tokens[i].amount;
        let temp_data = {
            id: id,
            symbol: token.symbol,
            icon: token.icon,
            amount: amount,
        }
        wallet_balance.balances.tokens.push(temp_data)
    }
    res.send(Object.values(wallet_balance));
}

const wallet_balance = async (req, res) => {
    let networkId = Number.parseInt(req.params.network,10);
    let walletAddress = req.params.address.toString();

    const balance_params = [{name: ":network", value: networkId}];
    const account_params = balance_params.concat({name: ":address", value: walletAddress})

    let url = zksEpnt.getEndpoint(zksEpnt.endpoints["account-balance"].path,  account_params);
    let tokens_url = zksEpnt.getEndpoint(zksEpnt.endpoints["token-list"].path, balance_params);
    let pairs_url = zksEpnt.getEndpoint(zksEpnt.endpoints["pair-list"].path, balance_params);

    let [account_data, token_data, pair_data] = await Promise.all([(await fetch(url)).json(), (await fetch(tokens_url)).json(), (await fetch(pairs_url)).json()])

    //let [account_resp, token_resp, pair_resp] = await Promise.all([fetch(url), fetch(tokens_url),  fetch(pairs_url)]);
    //let [account_data, token_data, pair_data] = await Promise.all([account_resp.json(), token_resp.json(), pair_resp.json()])

    //const account_data = await (await fetch(url)).json();
    //const token_data = await (await fetch(tokens_url)).json();
    //const pair_data = await (await fetch(pairs_url)).json();

    //console.log(token_data);

    let wallet_balance = {
        asset: {
            tokens: account_data.data.asset.tokens,
            pairs: account_data.data.asset.pairs,
            total: account_data.data.asset.total
        }
    }

    wallet_balance.balances = {tokens: [], pairs: []}
    const count = account_data.data.balances.tokens.length;
    for(let i = 0; i < count; i++)
    {
        const id = account_data.data.balances.tokens[i].id;
        //console.log(id)
        /**       NOTE!!!! 
         *  IMPORTANT JS ISSUE I HAD
         *  
         *  converting the find into function ends up returning undefined with how i wrote it
         *  I feel it's a an async issue but that just seems like the answer for my trouble with async programming in general
         *  
         */
        const token = token_data.data.find((t)=> { if(t.id === id) return t;}); 
        //console.log(token)
        const amount = account_data.data.balances.tokens[i].amount;
        let temp_data = {
            id: id,
            symbol: token.symbol,
            icon: token.icon,
            amount: amount,
        }
        wallet_balance.balances.tokens.push(temp_data)
    }
    res.send(Object.values(wallet_balance));
}




export default {
    wallet_balance,
    test_balance
}