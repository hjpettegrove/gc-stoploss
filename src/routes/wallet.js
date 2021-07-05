import { Router } from 'express';

import wallet_controller from '../controllers/wallet.js';

const router = Router();

router.get('/:network/address/:address/balance', wallet_controller.wallet_balance);

export default router;