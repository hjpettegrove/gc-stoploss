import { Router } from 'express';

import account_controller from '../controllers/account.js';

const router = Router();

router.get('/:network/address/:address/balance', account_controller.wallet_balance);

router.get('/:network/address/:address/info', account_controller.account_info);

export default router;