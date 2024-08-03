import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import productCtrl from '../controllers/product.controller.js'

const router = express.Router()

router.route('/api/product/:productId')
  .get(productCtrl.read)

router.route('/api/product/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, productCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, productCtrl.listByOwner)

router.route('/api/product/:productId')
  .put(authCtrl.requireSignin, productCtrl.isOwner, productCtrl.update)
  .delete(authCtrl.requireSignin, productCtrl.isOwner, productCtrl.remove)

router.param('productId', productCtrl.productByID)
router.param('userId', userCtrl.userByID)

export default router
