import { Router } from 'express';

import wallet_controller from '../controllers/wallet.js';

const router = Router();

router.get('/test/:network/address/:address/balance', wallet_controller.test_balance);

router.get('/:network/address/:address/balance', wallet_controller.wallet_balance);

export default router;