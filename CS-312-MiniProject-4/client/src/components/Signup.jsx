import { useState } from 'react';
import axios from 'axios';


function SignUp() {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

   
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(`/api/signup`, { userName, password });

            setMessage(response.data.message);

            setUsername('');
            setPassword('');
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Something went wrong during signup!"
            );
        }
        
    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>Sign Up!</h2>

            <div className="mb-3 mt-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={userName} onChange={(e) => setUsername(e.target.value)} required></input>
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
            </div>

            <button type="submit" className="btn btn-primary mb-3">Sign Up</button>
            {message && (       
                <p className="mt-3">{message}</p>   // appears when message contains something
            )}

        </form>
    );
}

export default SignUp;