import express from "express";


const app = express();
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import userRoutes from "./routes/users.js"; 
import platformRoutes from "./routes/platforms.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



//middleware 

//supports handling log in
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.json())
app.use(cors({ origin: "http://localhost:3000", }));

// Instead of sending the user ID in the body , the cookie helps to handle all ID related access
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

// Serve static files
// app.use("/upload", express.static(path.join(__dirname, "../public/upload")));


app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/platforms", platformRoutes);

app.listen(8800,()=> {
    console.log("Connected to backend!")
});

