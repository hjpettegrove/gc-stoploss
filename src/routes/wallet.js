import { Router } from 'express';

import controller from '../controllers/walletController.js'

const router = Router();

router.get('/balance/:network/:address', controller.getWalletBalance)

export default router;