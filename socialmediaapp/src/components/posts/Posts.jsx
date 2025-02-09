import Post from "../post/Post";
import "./posts.scss";
import post1 from '../../images/girl-afro.jpg';
import post2 from '../../images/comic-book-lifestyle-scene-with-friends_23-2151133652.avif';
import post3 from '../../images/side-view-anime-style-man-portrait.jpg';
const Posts = () => {
  //TEMPORARY
  const posts = [
    {
      id: 1,
      name: "Elsa Majimbo",
      userId: 1,
      profilePic: post1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      img: post2,
    },
    {
      id: 2,
      name: "Marai",
      userId: 2,
      profilePic: post3,
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
  ];

  return <div className="posts">
    {posts.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>;
};

export default Posts;
