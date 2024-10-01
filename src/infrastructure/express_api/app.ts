import express from "express";
import conferenceRoutes from './routes/conference.route'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(conferenceRoutes)


export default app;