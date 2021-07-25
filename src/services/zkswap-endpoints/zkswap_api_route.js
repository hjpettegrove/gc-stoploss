


export default class ZKSwapApiRoute
{
    constructor(endpoint)
    {
        this.api_endpoint = endpoint
        this.setNetwork(1)
    }

    /**
     * 
     * @param {integer} network - 1 for mainnet or
     */
    setNetwork(network = 1)
    {
        this.api_endpoint = this.api_endpoint.replace(':network', network)
    }


    setAddress(address = null)
    {
        this.api_endpoint = this.api_endpoint.replace(':address', address)
    }

    get endpoint()
    {
        return this.api_endpoint
    }
}