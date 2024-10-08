import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import './Feed.css'; // Ensure to include the CSS file

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
      const newPosts = await response.json();
      // Mock profile images for demonstration
      const postsWithImages = newPosts.map(post => ({
        ...post,
        profileImage: `https://picsum.photos/50?random=${post.id}`
      }));
      setPosts(prevPosts => [...prevPosts, ...postsWithImages]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, loading]);

  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post.id} className="post">
          <div className="post-header">
            <img src={post.profileImage} alt={`Profile ${post.id}`} className="profile-image" />
            <h2>{post.title}</h2>
          </div>
          <p>{post.body}</p>
        </div>
      ))}
      <div ref={ref}>
        {loading && <div className="spinner">Loading...</div>}
      </div>
    </div>
  );
};

export default Feed;
