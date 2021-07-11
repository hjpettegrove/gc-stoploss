import { Router } from 'express';
import account from './account.js';
import wallet from './wallet.js'

const router = Router();

router.use('/account', account);
router.use('/wallet', wallet);

export default router;