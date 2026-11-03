import React, { useState } from 'react';

function EditPost({post, onSave, onCancel}) {
    const[author, setAuthor] = useState(post.author);
    const[title, setTitle] = useState(post.title);
    const[content, setContent] = useState(post.content);
    
    
    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...post,  // copies existing posts properties (including id and date)
            author,   // overwrites existing property: author
            title,   // overwrites existing property: title
            content   // overwrites existing property: content
        });

    }
    
    
    return(
       <form onSubmit={handleSubmit}>
            <div className="mb-3"> 
                <label className="form-label">Author:</label>
                <input
                    type="text"
                    name="author" 
                    className="form-control"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />  
            </div>

            <div className="mb-3"> 
                <label className="form-label">Title:</label>
                <input
                    type="text"
                    name="title" 
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-3"> 
                <label className="form-label">Content:</label>
                <textarea
                    // name="postContent"
                    className="form-control"
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    />
                <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-primary btn-sm"> Save Changes </button>
                    <button onClick={onCancel} className="btn btn-secondary btn-sm"> Cancel </button>
                </div>
            </div>
        </form>
    );
}

export default EditPost