import { useState } from 'react';

function CreatePost({onAddPost}) {
    
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const handleSubmit = (e) => {
        // Doesn't refresh the page after submitting
        e.preventDefault();

        const newPost = {
                         
        author: author,
        title: title,
        content: content 
    
        };

        onAddPost(newPost);
        // forms clears after hitting submit
        setAuthor('');
        setTitle('');
        setContent('');

    }
    
    
    
    return (
        <section className="card shadow-sm border-0 mb-5">
            <div className="card-body p-4">

                <h2 className="h3 mb-3">Create Post </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4"> 
                        <div className="col-md-6">
                            <label 
                                htmlFor="author"
                                className="form-label">
                            </label>
                            <input
                            type="text"
                            id="author"
                            name="author"
                            className="form-control" 
                            placeholder="Your Name" 
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                            /> 
                        </div>

                        <div className="col-md-6">

                            <label
                                htmlFor="title"
                                className="form-label">
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Post Title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label
                        htmlFor="content"
                        className="form-label"> 
                        What would you like to say?
                    </label>
                        <textarea
                            id="postcontent"
                            name="postContent"
                            className="form-control"
                            placeholder="Write your post here..." 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                        <button type="submit" className="btn btn-primary"> Publish Post </button>
                </form>
            </div>
        </section>
        
    );
}

export default CreatePost 