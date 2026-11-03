import React, { useState } from 'react';
import EditPost from './EditPost';

function PostList({ posts, onDeletePost, onUpdatePost }) {
    
    const[editingId, setEditingId] = useState(null);

    return (
        <section>
                    
            <h2 className="mb-4"> Latest Posts </h2>
            
            {posts.map((post) => ( 

                <article key={post.id} className="card post-card shawdow-sm border-0 mb-4">
                    <div className="card-body p-4">
                        {editingId === post.id ? (
                            <EditPost 
                                key={post.id}
                                post={post}
                                onSave={(updatedPost) => {
                                    onUpdatePost(updatedPost);
                                    setEditingId(null);
                                }}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                        <>
                        
                        <h3 className="card-title">{post.title}</h3>

                        <p className="post-info"> By: {post.author} ♡ {post.date}</p>

                        <p className="card-text">{post.content}</p>

                        <div className="d-flex gap-3 mt-4">

                            <button onClick={() => setEditingId(post.id)} className="btn btn-outline-primary btn-sm"> Edit </button>

                            <button onClick={() => onDeletePost(post.id)} className="btn btn-outline-danger btn-sm"> Delete </button>
                        
                        </div>
                        </>
                        )}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default PostList
