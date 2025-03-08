import express from "express";


const app = express();
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import userRoutes from "./routes/users.js"; 

//middleware 
app.use(express.json())

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

app.listen(8800,()=> {
    console.log("Connected to backend!")
});

