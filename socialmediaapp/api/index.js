import express from "express";


const app = express();
// import authRoutes from "./routes/auth.js";
// import postRoutes from "./routes/posts.js";
// import commentRoutes from "./routes/comments.js";
// import likeRoutes from "./routes/likes.js";
import userRoutes from "./routes/users.js";

app.use("/api/users", userRoutes);

app.listen(8800,()=> {
    console.log("Connected to backend!")
});

