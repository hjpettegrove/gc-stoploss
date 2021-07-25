import { Router } from 'express';

import controller from '../controllers/walletController.js'



const router = Router();

router.get('/balance/:network/:address', controller.getWalletBalance)

//router.get('/test/:network/address/:address/balance', wallet_controller.test_balance);

//router.get('/:network/address/:address/balance', wallet_controller.wallet_balance);

export default router;