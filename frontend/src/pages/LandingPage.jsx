import { useNavigate } from "react-router-dom";
import { Globe, Shield, Star } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();

    return(
        <div className="min-h-screen flex" style={{backgroundColor: '#F2F5FF'}}>
            <div className="w-3/5 hidden md:block relative">
                <img src="/Image2-sq.jpeg" alt="Travel" className="w-full h-full object-cover"/>
                <div className="absolute inset-0" style={{background: 'linear-gradient(to right, transparent, #F2F5FF)'}}/>
            </div>

            <div className="w-full md:w-2/5 flex flex-col justify-center items-center text-center px-16">
                <h1 className="font-display text-4xl font-semibold text-primary mb-4">TravelMatch</h1>
                <p className="text-dark text-lg mb-2">Find your perfect travel companion!</p>
                <p className="text-dark text-base mb-10">Connect with other travellers, plan trips together and create unforgettable memories.</p>
                <div className="flex flex-col gap-4 w-full max-w-sm"> 
                    <button onClick={() => navigate('/login')} className="bg-primary text-white py-3 rounded-lg hover:bg-violet-800 font-medium text-base">Log in</button>
                    <button onClick={() => navigate('/register')} className="border-2 border-primary text-primary py-3 rounded-lg hover:bg-secondary hover:text-violet-800 hover:border-violet-800 font-medium text-base">Register</button>
                </div>
                <div className="flex gap-6 mt-10">
                    <div className="flex flex-col items-center gap-1">
                        <Globe size={20} className="text-primary"/>
                        <p className="text-dark text-xs">Explore</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Shield size={20} className="text-primary"/>
                        <p className="text-dark text-xs">Safe</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Star size={20} className="text-primary"/>
                        <p className="text-dark text-xs">Rated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;