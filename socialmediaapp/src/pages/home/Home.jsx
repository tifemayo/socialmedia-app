import "./Home.scss";
// import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"

const Home = () => {
  return (
    <div className="home">
      <Share/>
      <Posts/>
    </div>
  )
}

export default Home;
