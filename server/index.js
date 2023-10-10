import express  from "express";
import mongoose  from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import verifyToken from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";

/* CONFIGURATION */
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.urlencoded({ limit: "30mb"}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirName, 'public/assets'), {fallthrough: false}));


/** FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/** ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/** ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

/** POSTS */
app.use("/post", postRoutes);


/** MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}). then(() => {
    app.listen(PORT, () => {
        console.log(`Server port: ${PORT}`);
        // User.collection.deleteMany({});
        // Post.collection.deleteMany({});
        // User.insertMany(users);
        // Post.insertMany(posts);
    });
    console.log(path.join(__dirName, 'public/assets'))
}).catch((error) => {
    console.log(`${error} did not connect`);
});