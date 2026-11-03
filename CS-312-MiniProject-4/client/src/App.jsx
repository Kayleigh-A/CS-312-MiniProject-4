import React, { useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
import Header from "./components/Header"
import CreatePost from "./components/CreatePost"
import PostList from "./components/PostList"
import SignUp from "./components/Signup"
import Login from "./components/Login"

function App() {
  
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get("/api/posts")
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // runs only if the user is logged in!
    if (user) {
      getPosts();
    } else {
      setPosts([]);
    }

   
  }, [user]); // [] -> runs effect once instead of after each render

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    checkSession();
  }, []);

  const addPost = async (newPost) => {
    // setPosts((prevPosts) => [...prevPosts, newPost]);
    try {
      const response = await axios.post("/api/posts", newPost);
      setPosts((prevPosts) => [...prevPosts, response.data])
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const deletePost = async (id) => {

    try{
      await axios.delete(
        `/api/posts/${id}`
      );

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("Error deleting post!", error);
    }

    
  };

  const updatePost = async (updatedPost) => {
    
    try{

      const response = await axios.put(
        `/api/posts/${updatedPost.id}`, updatedPost
      );

      setPosts((prevPosts) => 
            prevPosts.map((post) => 
              post.id === updatedPost.id ? response.data : post
            )
      );

    } catch (error) {
      console.error("Error editing post:", error);
    }
    
    
    
  };

  const handleLogout = async () => {
    try{
      await axios.post(`/api/logout`);
      setUser(null);
    } catch (error) {
      console.error("Logout failed!", error);
    }
  };



  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Header />
          {user ? (
            <div> 
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="mb-0">Welcome Back {user.username}! </p>
                <button onClick={handleLogout} className='btn btn-primary btn-sm 'b>Logout</button>
              </div>
              <CreatePost onAddPost={addPost} />
              <PostList 
                posts={posts} 
                onDeletePost={deletePost} 
                onUpdatePost={updatePost} 
              />
            </div>
          ): showLogin ? (
            <>
              <Login onLogin={setUser}/>
              <p>Don't have an account?</p>
              <button onClick={() => setShowLogin(false)} >Sign up!</button>
              </>
          ): (
            <>
              <SignUp />
              <p>Already have an account?</p>
              <button onClick={() => setShowLogin(true)}>Log In</button>
           </>
          )}
          
          
          
          
          
        </div>
      </div>   
    </div>    
        
  );
  
}

export default App
