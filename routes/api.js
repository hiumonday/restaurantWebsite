const { Router } = require('express')
const APIController = require('../controller/APIController')

const router = Router();

// const initAPIRoute = (app) => {
//     router.post('/create-user', APIController.createNewUser); // method POST -> CREATE data
    
//     return app.use('/api/v1/', router)
// }

router.post('/create-customer', APIController.createNewCustomer);
router.post('/order',APIController.confirmOrder);


//module.exports = initAPIRoute;
module.exports = router;