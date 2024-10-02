import * as express from "express";
import {organizeConference} from "../controllers/conference.controllers";
import {isAuthenticated} from "../middlewares/authentication.middleware";
import container from "../../../infrastructure/express_api/config/dependency-injection";

const router = express.Router();

router.use(isAuthenticated)
router.post('/conference', organizeConference(container));

export default router;