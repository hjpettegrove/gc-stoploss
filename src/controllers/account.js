
import zksyncEndpoints from '../services/zksync-endpoints.js';

import fetch from 'node-fetch';

const wallet_balance = async (req, res)  => {
    let networkId = Number.parseInt(req.params.network,10);
    let walletAddress = req.params.address.toString();
    let url = zksyncEndpoints.getEndpoint(zksyncEndpoints.endpoints["account-balance"].path,  [{name: ":network", value: networkId}, {name: ":address", value: walletAddress}]);
    const data = await (await fetch(url)).json();
    res.send(Object.values(data));
}

const account_info = async (req, res) => {
    let networkId = Number.parseInt(req.params.network,10);
    let walletAddress = req.params.address.toString();
    let url = zksyncEndpoints.getEndpoint(zksyncEndpoints.endpoints["account-info"].path,  [{name: ":network", value: networkId}, {name: ":address", value: walletAddress}]);
    const data = await (await fetch(url)).json();
    res.send(Object.values(data));
}
export default {
    wallet_balance,
    account_info,
}