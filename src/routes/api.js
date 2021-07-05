import { Router } from 'express';
import token from './tokens.js';
import pairs from './pairs.js';
import account from './account.js';
import wallet from './wallet.js'

const router = Router();

router.use('/tokens', token);
router.use('/pairs', pairs);
router.use('/account', account);
router.use('/wallet', wallet);

export default router;