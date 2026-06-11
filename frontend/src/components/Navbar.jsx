import { Link, useNavigate } from "react-router-dom";
import { Compass, Luggage, User, LogOut } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return(
        <nav className="bg-white px-8 py-4 flex justify-between items-center border-b border-accent">
            <Link to="/trips" className="font-display text-2xl text-primary">TravelMatch</Link>
            <div className="flex gap-4 items-center">
                <Link to="/trips" className="text-dark text-base hover:text-primary flex items-center gap-1 mr-2"><Compass size={16}/>Trips</Link>
                <Link to="/my-trips" className="text-dark text-base hover:text-primary flex items-center gap-1 mr-2"><Luggage size={16}/>My Trips</Link>
                <Link to="/profile" className="text-dark text-base hover:text-primary flex items-center gap-1 mr-2"><User size={16}/>My Profile</Link>
                <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-base font-medium flex items-center gap-1"><LogOut size={16}/>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;