import { useState } from 'react';
import axios from 'axios';

function Login({onLogin}) {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
   
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(`/api/login`, { userName, password });
            onLogin(response.data.user);
            setMessage(response.data.message);

            setPassword('');
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Something went wrong during login!"
            );
        }
    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>Login</h2>

            <div className="mb-3 mt-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={userName} onChange={(e) => setUsername(e.target.value)} required></input>
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
            </div>

            <button type="submit" className="btn btn-primary mb-3">Login</button>
            {message && (       
                <p className="mt-3">{message}</p>   // appears when message contains something
            )}
        </form>
    );
}

export default Login;