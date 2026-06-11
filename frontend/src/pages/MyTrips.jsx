import { useEffect, useState } from "react";
import { getMyTrips, getJoinedTrips } from "../api/trips";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function MyTrips() {
    const [mojiTrips, setMojiTrips] = useState([]);
    const [pridruzeniTrips, setPridruzeniTrips] = useState([]);
    const [aktivniTab, setAktivniTab] = useState('my');
    const navigate = useNavigate();

    useEffect(() => {
        const dohvatiMojiTrips = async () => {
            try {
                const odgovor = await getMyTrips();
                setMojiTrips(odgovor.data);
            } catch (err) {
                console.error(err);
            }
        };
        const dohvatiPridruzeniTrips = async () => {
            try {
                const odgovor = await getJoinedTrips();
                setPridruzeniTrips(odgovor.data);
            } catch (err) {
                console.error(err);
            }
        };
        dohvatiMojiTrips();
        dohvatiPridruzeniTrips();
    }, []);
    const brojNoci = (start, end) => {
        const a = new Date(start);
        const b = new Date(end);
        return Math.round((b-a)/(1000*60*60*24));
    };

    const aktivni = (aktivniTab === 'my' ? mojiTrips : pridruzeniTrips).filter(t => t.status === 'active');
    const zavrseni = (aktivniTab === 'my' ? mojiTrips : pridruzeniTrips).filter(t => t.status === 'completed');
    
    return (
        <div className="min-h-screen bg-light">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-dark">My Trips</h2>
                    <button onClick={() => navigate('/my-trips/create')} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-violet-800 font-medium flex items-center gap-2">+ Create New Trip</button>
                </div>
                <div className="flex gap-2 mb-6 pt-4 border-b border-accent">
                    <button onClick={() => setAktivniTab('my')} className={`px-4 py-2 font-medium text-base ${aktivniTab === 'my' ? 'text-primary border-b-2 border-primary' : 'text-dark hover:text-primary'}`}>My Trips</button>
                    <button onClick={() => setAktivniTab('joined')} className={`px-4 py-2 font-medium text-base ${aktivniTab === 'joined' ? 'text-primary border-b-2 border-primary' : 'text-dark hover:text-primary'}`}>Joined Trips</button>
                </div>
                <div className="flex flex-col gap-4">
                    {aktivni.map(trip => {
                        const bojeKategorija = {
                            adventure: {bg: '#E7F4EF', fg: '#0C7A5E'},
                            cultural:{bg: '#EEF1FB', fg: '#3D52B5'},
                            relaxation: {bg: '#FDF2E6', fg: '#B5731F'},
                            sport: {bg: '#FBECEC', fg: '#C0413D'},
                            wellness: {bg: '#F1ECFA', fg: '#7A4FC0'},
                        }[trip.kategorija] || {bg: '#DEE6FC', fg: '#6366F1'};
                        return(
                            <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="bg-white border border-accent rounded-xl cursor-pointer hover:shadow-md transition-shadow p-6 mb-4">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h3 className="text-lg font-semibold text-dark">{trip.naslov}</h3>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap" style={{background: bojeKategorija.bg, color: bojeKategorija.fg}}>{trip.kategorija}</span>
                                </div>
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"/>
                                    <span className="text-dark text-sm font-medium px-2">{trip.pocetni_grad}</span>
                                    <div className="flex-1 border-t border-dashed border-accent"/>
                                    <span className="text-dark text-sm font-medium px-2">{trip.zavrsni_grad}</span>
                                    <div className="w-2 h-2 rounded-full border-2 border-primary flex-shrink-0"/>
                                </div>
                                <div className="flex items-center gap-4 pt-3 text-sm text-accent">
                                    <span>{trip.datum_polaska?.split('T')[0]}</span>
                                    <span>{brojNoci(trip.datum_polaska, trip.datum_povratka)} nights</span>
                                    <span className="ml-auto text-primary font-medium">View trip →</span>
                                </div>
                            </div>
                        )
                    })}
                    {zavrseni.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-base font-medium text-accent mb-3">Completed trips</h3>
                            {zavrseni.map(trip => {
                                const bojeKategorija = {
                                    adventure: {bg: '#E7F4EF', fg: '#0C7A5E'},
                                    cultural:{bg: '#EEF1FB', fg: '#3D52B5'},
                                    relaxation: {bg: '#FDF2E6', fg: '#B5731F'},
                                    sport: {bg: '#FBECEC', fg: '#C0413D'},
                                    wellness: {bg: '#F1ECFA', fg: '#7A4FC0'},
                                }[trip.kategorija] || {bg: '#DEE6FC', fg: '#6366F1'};
                                return(
                                    <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="bg-white border border-accent rounded-xl cursor-pointer opacity-60 hover:shadow-md transition-shadow p-6 mb-4">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <h3 className="text-lg font-semibold text-dark">{trip.naslov}</h3>
                                            <span className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap" style={{background: bojeKategorija.bg, color: bojeKategorija.fg}}>{trip.kategorija}</span>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"/>
                                            <span className="text-dark text-sm font-medium px-2">{trip.pocetni_grad}</span>
                                            <div className="flex-1 border-t border-dashed border-accent"/>
                                            <span className="text-dark text-sm font-medium px-2">{trip.zavrsni_grad}</span>
                                            <div className="w-2 h-2 rounded-full border-2 border-primary flex-shrink-0"/>
                                        </div>
                                        <div className="flex items-center gap-4 pt-3 text-sm text-accent">
                                            <span>{trip.datum_polaska?.split('T')[0]}</span>
                                            <span>{brojNoci(trip.datum_polaska, trip.datum_povratka)} nights</span>
                                            <span className="ml-auto text-primary font-medium">View trip →</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default MyTrips;