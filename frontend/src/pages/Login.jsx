import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [greska, setGreska] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setGreska('');
        setLoading(true);
        try {
            const odgovor = await login({
                email, lozinka
            });
            console.log(odgovor.data);
            localStorage.setItem('token', odgovor.data.token);
            localStorage.setItem('userId', odgovor.data.korisnik.id);
            navigate('/trips');
        } catch (err) {
            console.error(err);
            setGreska('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center pb-20 relative" style={{backgroundImage: 'url(/Image1-field.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-surface opacity-30"/>
            <div className="relative z-10 bg-surface/90 p-10 rounded-xl shadow-md w-full max-w-lg">
                <div className="text-center mb-7">
                    <h1 className="font-display text-3xl font-semibold text-primary mb-2">TravelMatch</h1>
                    <p className="text-dark text-base">Log in to continue</p>
                </div>
                <div className="mx-auto w-2/3 h-px bg-accent mb-10"></div>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter Email"
                            type="email"
                            className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark"
                        />
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-dark text-base font-medium">Password</label>
                        <input 
                            value={lozinka} 
                            onChange={(e) => setLozinka(e.target.value)} 
                            placeholder="Enter Password"
                            type="password"
                            className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark"
                        />
                    </div>    
                    {greska && <p className="text-red-600 text-sm">{greska}</p>}
                    <button type="submit" className="bg-primary text-white py-3 rounded-lg hover:bg-violet-800 font-medium mt-2">
                        {loading ? 'Logging in' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-base text-dark mt-4">Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link></p>
            </div>
        </div>
    );
}

export default Login;