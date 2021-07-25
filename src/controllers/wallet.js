
import zksEpnt from '../services/zksync-endpoints.js';

import fetch from 'node-fetch';
import cachedFetch from '../helpers/cachedFetch.js';
import fs from 'fs';

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
        },
        balances: {
            tokens: [],
            pairs: []
        }
    }

    const token_count = account_data.data.balances.tokens.length;
    for(let i = 0; i < token_count; i++)
    {
        const id = account_data.data.balances.tokens[i].id;
        const token = token_data.data.find((t)=> { if(t.id === id) return t;}); 
        const amount = account_data.data.balances.tokens[i].amount;
        let temp_data = {
            id: id,
            symbol: token.symbol,
            icon: token.icon,
            amount: amount,
        }
        wallet_balance.balances.tokens.push(temp_data)
    }
    const pair_count = account_data.data.balances.pairs.length;
    for(let i = 0; i < pair_count; i++)
    {
        const pair_id = account_data.data.balances.pairs[i].id;
        const pair_address = account_data.data.balances.pairs[i].address;
        const pair = pair_data.data.find((p) => { if(p.id == pair_id) return t })
        const id_a = pair.id_a
        const token_a = token_data.data.find((t) => { if(t.id === id_a) return t;});
        const id_b = pair.id_b
        const token_b = token_data.data.find((t) => { if(t.id === id_b) return t;});
        const token_amount = account_data.data.balances.pairs[i].amount
        const temp_pair = {

        }
    }
    /**
    const pair_count = account_data.data.balances.pairs.length;
    for(let i = 0; i < pair_count; i++)
    {
        const id = account_data.data.balances.pairs[i].id;
    }
   
   
    fs.writeFile('./data/pair_data', JSON.stringify(pair_data), (err) => {
        if(err)
            console.error(err);
        else    
            console.log('success writing file')
    });
    fs.writeFile('./data/token_data', JSON.stringify(token_data), (err) => {
        if(err)
            console.error(err);
        else    
            console.log('success writing file')
    });
     */
    res.send(Object.values(account_data.data.balances.pairs));
}





/**
 * Makes API call to build wallet contents from zks
 * @param {*} req 
 * @param {*} res 
 */
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