import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const router = express.Router();

app.use(express.json());
