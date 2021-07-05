
const app_url = 'https://api.zks.app';

const endpoints = {
    "token-list": {
        "path": "/:network/tokens",
        "params": [":network"]
    },
    "token-prices": {
        "path": "/:network/tokens/price",
        "params": [":network"]
    },
    "pair-list": {
        "path": "/:network/pairs",
        "params": [":network"]
    },
    "pair-prices": {
        "path": "/:network/pairs/price",
        "params": [":network"]
    },
    "account-balance": {
        "path": "/:network/account/:address/balances",
        "params": [":network", ":address"]
    },
    "account-info": {
        "path": "/:network/account/:address/info",
        "params": [":network", ":address"]
    }
};

function setNetwork(endpoint, network)
{
    return endpoint.replace(":network", network);
}

function setAddress(endpoint, address)
{
    return endpoint.replace(":address", address);
}

/**
 * 
 * @param string    endpoint 
 * @param Array     params [{"name": "param_name", "value": "param_value"}, {"name": "param_name2", "value": "param_value2"}]
 */
function getEndpoint(endpoint, params) 
{
    let endpoint_url = app_url + endpoint;
    //console.log(endpoint_url)
    if(Array.isArray(params)) 
    {
        params.forEach((arrayItem) => {
            endpoint_url = endpoint_url.replace(arrayItem.name, arrayItem.value)
        });
        //console.log(endpoint_url);
        return endpoint_url;
    }
    else
    {
        throw("Invalid Argument type supplied for params in getEndpoint of zksync-endpoints.js");
    }
}

export default {
    getEndpoint,
    endpoints
}