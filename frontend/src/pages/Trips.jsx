import { useState, useEffect } from "react";
import { getAllTrips } from "../api/trips";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import { Filter, Search } from "lucide-react";


function Trips() {
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState('');
    const [filterDatumPolaska, setFilterDatumPolaska] = useState('');
    const [filterDatumPovratka, setFilterDatumPovratka] = useState('');
    const [filterGrad, setFilterGrad] = useState('');
    const [filterKategorija, setFilterKategorija] = useState('');
    const [filterSpol, setFilterSpol] = useState('');
    const [filterMinDob, setFilterMinDob] = useState('');
    const [filterMaxDob, setFilterMaxDob] = useState('');
    const [filterMinBudzet, setFilterMinBudzet] = useState('');
    const [filterMaxBudzet, setFilterMaxBudzet] = useState('');
    const [filterSmjestaj, setFilterSmjestaj] = useState('');
    const navigate = useNavigate();
    useEffect (() => {
        const dohvatiTrips = async () => {
            try {
               const odgovor = await getAllTrips(); 
               setTrips(odgovor.data);
            } catch (err) {
                console.error(err);
            }
        };
        dohvatiTrips();
    }, []);
    const pretrazi = async () => {
        try {
            const odgovor = await getAllTrips({
                grad: filterGrad || undefined, datum_polaska: filterDatumPolaska || undefined, datum_povratka: filterDatumPovratka || undefined, kategorija: filterKategorija || undefined, dozvoljeni_spol: filterSpol || undefined,
                minimalna_dob: filterMinDob || undefined, maksimalna_dob: filterMaxDob || undefined, tip_smjestaja: filterSmjestaj || undefined, min_budzet: filterMinBudzet || undefined, max_budzet: filterMaxBudzet || undefined,
            });
            setTrips(odgovor.data);
        } catch (err) {
            console.error(err);
        }
    };
    const brojNoci = (start, end) => {
        const a = new Date(start);
        const b = new Date(end);
        return Math.round((b-a)/(1000*60*60*24));
    };
    return (
        <div className="min-h-screen bg-light">
            <Navbar />
            <div className="relative h-64 overflow-hidden">
                <img src="/Image2-sq.jpeg" alt="Travel" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-light opacity-60"/>
                <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 30%, #F7F5FC)'}}/>
                <div className="absolute inset-0 flex flex-col justify-start pt-12 px-8 max-w-4xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-widest text-primaryDark mb-2">Find your people</p>
                    <h1 className="text-4xl font-bold text-primaryDark mb-2">Explore Trips</h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
                <div className="mb-8 flex items-center bg-white border border-accent overflow-hidden shadow-sm relative z-10" style={{borderRadius: '999px', padding: '7px 7px 7px 10px', marginTop: '-7rem'}}>
                    <div className="flex-1 px-4 py-2 border-r border-accent">
                        <p className="text-xs font-bold text-primary mb-1">Where</p>
                        <input value={filterGrad} onChange={(e) => setFilterGrad(e.target.value)} placeholder="Search by city..." className="w-full text-dark text-sm focus:outline-none bg-transparent font-medium"/>
                    </div>
                    <div className="flex-1 px-4 py-2 border-r border-accent">
                        <p className="text-xs font-bold text-primary mb-1">Departure</p>
                        <input type="date" value={filterDatumPolaska} onChange={(e) => setFilterDatumPolaska(e.target.value)} className="w-full text-dark text-sm focus:outline-none bg-transparent"/>
                    </div>
                    <div className="flex-1 px-4 py-2 border-r border-accent">
                        <p className="text-xs font-bold text-primary mb-1">Return</p>
                        <input type="date" value={filterDatumPovratka} onChange={(e) => setFilterDatumPovratka(e.target.value)} className="w-full text-dark text-sm focus:outline-none bg-transparent"/>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 text-dark text-sm font-bold hover:bg-secondary rounded-full mx-1"><Filter size={15}/> Filters</button>
                    <button onClick={pretrazi} className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-violet-800 flex-shrink-0 mr-2"><Search size={15}/></button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                            <h3 className="text-lg font-semibold text-dark mb-6">Additional Filters</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-dark text-sm font-medium">Category</label>
                                    <select value={filterKategorija} onChange={(e) => setFilterKategorija(e.target.value)} className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base">
                                        <option value="">All</option>
                                        <option value="adventure">Adventure</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="relaxation">Relaxation</option>
                                        <option value="sport">Sport</option>
                                        <option value="wellness">Wellness</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-dark text-sm font-medium">Gender</label>
                                    <select value={filterSpol} onChange={(e) => setFilterSpol(e.target.value)} className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base">
                                        <option value="">All</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-dark text-sm font-medium">Age Range</label>
                                    <div className="flex gap-3">
                                        <input type="number" value={filterMinDob} onChange={(e) => setFilterMinDob(e.target.value)} placeholder="Min age" className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base w-full"/>
                                        <input type="number" value={filterMaxDob} onChange={(e) => setFilterMaxDob(e.target.value)} placeholder="Max age" className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base w-full"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-dark text-sm font-medium">Budget Range</label>
                                    <div className="flex gap-3">
                                        <input type="number" value={filterMinBudzet} onChange={(e) => setFilterMinBudzet(e.target.value)} placeholder="Min" className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base w-full"/>
                                        <input type="number" value={filterMaxBudzet} onChange={(e) => setFilterMaxBudzet(e.target.value)} placeholder="Max" className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base w-full"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-dark text-sm font-medium">Accommodation</label>
                                    <select value={filterSmjestaj} onChange={(e) => setFilterSmjestaj(e.target.value)} className="border border-accent rounded-lg px-3 py-2 bg-white text-dark text-base">
                                        <option value="">All</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="hostel">Hostel</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="room">Room</option>
                                        <option value="camp">Camp</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={() => { pretrazi(); setShowModal(false); }} className="bg-primary text-white py-2 rounded-lg hover:bg-violet-800 font-medium flex-1">Apply</button>
                                <button onClick={() => {setFilterKategorija(''); setFilterSpol(''); setFilterMinDob(''); setFilterMaxDob(''); setFilterMinBudzet(''); setFilterMaxBudzet(''); setFilterSmjestaj(''); setShowModal(false);}} className="border border-accent text-dark py-2 rounded-lg hover:bg-secondary font-medium flex-1">Clear</button>
                            </div>
                        </div>
                    </div>
                )}

                {trips.length === 0 && (<p className="text-dark text-base text-center mt-8">No trips found.</p>)}
                <div className="flex flex-col gap-4">
                    {trips.map(trip => {
                        const bojeKategorija = {
                            adventure: {bg: '#E7F4EF', fg: '#0C7A5E'},
                            cultural:{bg: '#EEF1FB', fg: '#3D52B5'},
                            relaxation: {bg: '#FDF2E6', fg: '#B5731F'},
                            sport: {bg: '#FBECEC', fg: '#C0413D'},
                            wellness: {bg: '#F1ECFA', fg: '#7A4FC0'},
                        }[trip.kategorija] || {bg: '#DEE6FC', fg: '#6366F1'};
                        return (
                            <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="bg-white border border-accent rounded-xl cursor-pointer hover:shadow-md transition-shadow p-6">
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
            </div>
        </div>
    );
}

export default Trips;