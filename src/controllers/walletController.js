import cachedFetch from '../helpers/cachedFetch.js'
import ZKSwapApiRoute from '../services/zkswap-endpoints/zkswap_api_route.js';
import wallet from "./wallet.js";

const getWalletBalance = async (req, res) => {
    let networkId = Number.parseInt(req.params.network,10)
    let walletAddress = req.params.address.toString()
    
    const account_balance_route = new ZKSwapApiRoute('https://api.zks.app/:network/account/:address/balances')
    account_balance_route.setAddress(walletAddress)
    const account_data = await (await cachedFetch(account_balance_route.endpoint)).json()


    //const zks_api_url_accountbalance = 'https://api.zks.app/:network/account/:address/balances'
    //let api_endpoint = zks_api_url_accountbalance.replace(':network', networkId).replace(':address', walletAddress)
    //const account_data = await (await cachedFetch(api_endpoint)).json()

    const zks_api_url_tokens = new ZKSwapApiRoute('https://api.zks.app/:network/tokens')
    const token_data = await (await cachedFetch(zks_api_url_tokens.endpoint)).json()
    //const token_data = await (await fs.readFile(path.resolve(__dirname, ),'utf8')).json()

    const zks_api_pair_data = new ZKSwapApiRoute('https://api.zks.app/:network/pairs')
    const pair_data = await (await cachedFetch(zks_api_pair_data.endpoint)).json()


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
        const temp_data = {
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
        const pair = pair_data.data.find((p) => { if(p.id == pair_id) return p;})
        const token_a = token_data.data.find((t) => { if(t.id === pair.id_a) return t;});
        const token_b = token_data.data.find((t) => { if(t.id === pair.id_b) return t;});
        const token_amount = account_data.data.balances.pairs[i].amount
        const temp_pair = {
            id: pair_id,
            address: pair_address,
            token_a : token_a,
            token_b: token_b,
            pair_amount: token_amount
        }
        wallet_balance.balances.pairs.push(temp_pair)
    }
    res.send(Object.values(wallet_balance));
}

export default {
    getWalletBalance
}