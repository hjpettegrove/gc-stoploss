import cachedFetch from '../helpers/cachedFetch.js'
import cachedFetchWithErrorHandling from '../helpers/cachedFetchWithErrorHandling.js';
import ZKSwapApiRoute from '../services/zkswap-endpoints/zkswap_api_route.js';


<<<<<<< HEAD
=======
// New comment
>>>>>>> 2c40e9c872922f27c05fbd8fe5bd631c12c066e0
const getWalletBalance = async (req, res) => {
    let wallet_balance = {
        wallet: {
            balances: {
                token_balance: 0,
                pair_balance: 0,
                total_balance: 0,
            },
            assets: {
                tokens: [],
                pairs: []
            }
        }
    }

    let networkId = Number.parseInt(req.params.network,10)
    let walletAddress = req.params.address.toString()

    //TODO - Implement better solution for four!!!! API queries
    // There is a more elegant way to solve this.  Go back to the nodejs design patterns book and look at concurrency solutions
    
    const account_balance_route = new ZKSwapApiRoute('https://api.zks.app/v2/:network/account/:address/balances')
    account_balance_route.setAddress(walletAddress)
    const account_data = await cachedFetchWithErrorHandling(account_balance_route.endpoint)
    
    const zks_api_url_tokens = new ZKSwapApiRoute('https://api.zks.app/v2/:network/tokens')
    const token_data = await cachedFetchWithErrorHandling(zks_api_url_tokens.endpoint)
 
    const zks_api_pair_data = new ZKSwapApiRoute('https://api.zks.app/v2/:network/pairs')
    const pair_data = await cachedFetchWithErrorHandling(zks_api_pair_data.endpoint)

    const zks_api_token_prices = new ZKSwapApiRoute('http://api.zks.app/v2/:network/tokens/price')
    const token_prices = await cachedFetchWithErrorHandling(zks_api_token_prices.endpoint)

    console.log(account_data);
    // FIXME - clean this up, some type of object merge should work here
    wallet_balance.wallet.balances.token_balance = account_data.data.asset.tokens;
    wallet_balance.wallet.balances.pair_balance = account_data.data.asset.pairs;
    wallet_balance.wallet.balances.total_balance = account_data.data.asset.total;


    const token_count = account_data.data.balances.tokens.length;
    for(let i = 0; i < token_count; i++)
    {
        const id = account_data.data.balances.tokens[i].id;
        const token = token_data.data.find((t)=> { if(t.id === id) return t;}); 
        const amount = account_data.data.balances.tokens[i].amount;
        const usdValue = token_prices.data.find((t) => {if(t.id === id) return t;})
        const temp_data = {
            id: id,
            symbol: token.symbol,
            icon: token.icon,
            amount: amount,
            value_usd: amount*usdValue.price
        }
        wallet_balance.wallet.assets.tokens.push(temp_data)
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
        wallet_balance.wallet.assets.pairs.push(temp_pair)
    }
    res.send(Object.values(wallet_balance));
}

export default {
    getWalletBalance
}