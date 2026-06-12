import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrip, sendRequest, getParticipants, getRequests, handleRequest, getMyRequest, removeParticipant } from "../api/trips";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trash, Star, Calendar, Moon, Users, Telephone, Mail } from "lucide-react";
import { addRating, getMyRatings } from "../api/ratings";

function FitBounds({ koordinate }) {
    const map = useMap();
    useEffect(() => {
        if (koordinate.length > 1) {
            const bounds = koordinate.map(k => [k.lat, k.lng]);
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [koordinate, map]);
    return null;
}

function TripDetails() {
    const {id} = useParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [sudionici, setSudionici] = useState([])
    const [zahtjevi, setZahtjevi] = useState([]);
    const [zahtjevPoslan, setZahtjevPoslan] = useState(false);
    const [koordinate, setKoordinate] = useState([]);
    const [showRatingForm, setShowRatingForm] = useState(null);
    const [ocjena, setOcjena] = useState(5);
    const [komentar, setKomentar] = useState('');
    const [ocjenjeniKorisnici, setOcjenjeniKorisnici] = useState([]);
    const userId = parseInt(localStorage.getItem('userId'));
    const jeSudionik = sudionici.some(s => s.id === userId);
    const navigate = useNavigate();

    const customIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });

    const obradiZahtjev = async (requestId, status) => {
            try {
                await handleRequest(id, requestId, status);
                const odgovor = await getRequests(id);
                const odgovor2 = await getParticipants(id);
                setZahtjevi(odgovor.data);
                setSudionici(odgovor2.data);
            } catch (err) {
                console.error(err);
            }
    }
    const dohvatiKoordinate = async (gradovi) => {
        const coords = [];
        for (const grad of gradovi) {
            const odgovor = await fetch(`https://nominatim.openstreetmap.org/search?q=${grad.grad}&format=json&limit=1`);
            const podaci = await odgovor.json();
            if (podaci.length > 0) {
                coords.push({
                    naziv: grad.grad, lat: parseFloat(podaci[0].lat), lng: parseFloat(podaci[0].lon)
                });
            }
        }
        return coords;
    }

    const ukloniSudionika = async (sudionikId) => {
        try {
            await removeParticipant(id, sudionikId);
            const odgovor = await getParticipants(id);
            setSudionici(odgovor.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOcjenu = async (ocjenjenId) => {
        try {
            await addRating(id, {
                ocjenjen_id: ocjenjenId, ocjena, komentar
            });
            setOcjenjeniKorisnici([...ocjenjeniKorisnici, ocjenjenId]);
            setShowRatingForm(null);
            setOcjena(5);
            setKomentar('');
        } catch (err) {
            console.error(err);
        }
    }

    const brojNoci = (start, end) => {
        const a = new Date(start);
        const b = new Date(end);
        return Math.round((b-a)/(1000*60*60*24));
    };

    useEffect(() => {
        const dohvatiTrip = async () => {
            try {
                const odgovor = await getTrip(id);
                const odgovor2 = await getParticipants(id);
                setTripDetails(odgovor.data);
                setSudionici(odgovor2.data);
                if (odgovor.data.organizator_id === userId){
                    const odgovor3 = await getRequests(id);
                    setZahtjevi(odgovor3.data);
                }
                const odgovor4 = await getMyRequest(id);
                setZahtjevPoslan(odgovor4.data.sent);
                const coords = await dohvatiKoordinate(odgovor.data.gradovi);
                setKoordinate(coords);
                const odgovor5 = await getMyRatings(id);
                setOcjenjeniKorisnici(odgovor5.data);
            } catch (err) {
                console.error(err);
            }
        };
        dohvatiTrip();
    }, []);
    
    return (
        <div className="min-h-screen bg-light">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
                {tripDetails && (() => {
                    const bojeKategorija = {
                            adventure: {bg: '#E7F4EF', fg: '#0C7A5E'},
                            cultural:{bg: '#EEF1FB', fg: '#3D52B5'},
                            relaxation: {bg: '#FDF2E6', fg: '#B5731F'},
                            sport: {bg: '#FBECEC', fg: '#C0413D'},
                            wellness: {bg: '#F1ECFA', fg: '#7A4FC0'},
                    }[tripDetails.kategorija] || {bg: '#DEE6FC', fg: '#6366F1'};
                    return(
                        <div className="flex flex-col gap-6">
                            <div className="bg-surface border border-accent rounded-2xl p-7 mb-6 shadow-md">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background: bojeKategorija.bg, color: bojeKategorija.fg}}>{tripDetails.kategorija}</span>
                                        <h2 className="text-3xl font-bold text-dark mt-5 mb-2">{tripDetails.naslov}</h2>
                                    </div>
                                    {parseInt(tripDetails.organizator_id) === userId && (
                                        <button onClick={() => navigate(`/my-trips/edit/${id}`)} className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary whitespace-nowrap">Edit Trip</button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3 mt-8">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-body border border-accent px-3 py-2 rounded-full">
                                        <Calendar size={14} className="text-primary"/>{tripDetails.datum_polaska?.split('T')[0]} — {tripDetails.datum_povratka?.split('T')[0]}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-semibold text-body border border-accent px-3 py-2 rounded-full">
                                        <Moon size={14} className="text-primary"/>{brojNoci(tripDetails.datum_polaska, tripDetails.datum_povratka)} nights
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-semibold text-body border border-accent px-3 py-2 rounded-full">
                                        <Users size={14} className="text-primary"/>{sudionici.length} traveling
                                    </span>
                                    {tripDetails.status === 'active' && (
                                        <span className="flex items-center gap-2 text-sm font-semibold text-primary border border-accent px-3 py-2 rounded-full">
                                            <span className="w-2 h-2 rounded-full bg-primary"/>Active · accepting
                                        </span>
                                    )}
                                </div>
                                {tripDetails.opis && <p className="text-body text-base mt-6">{tripDetails.opis}</p>}
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap">Route</h3>
                                    <div className="flex-1 h-px bg-accent"/>
                                </div>
                                <div className="flex gap-8">
                                    <div className="bg-surface border border-accent rounded-xl p-5 min-w-48">
                                        {tripDetails.gradovi.map((grad,index) => (
                                            <div key={grad.redoslijed} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full mt-1 ${index === tripDetails.gradovi.length - 1 ? 'bg-primary' : 'border-2 border-primary bg-white'}`}/>
                                                    {index < tripDetails.gradovi.length - 1 && (
                                                        <div className="w-px bg-accent flex-1 my-1" style={{minHeight: '40px'}}/>
                                                    )}
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-dark font-semibold text-base">{grad.grad}</p>
                                                    {index < tripDetails.gradovi.length - 1 && grad.prijevoz && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted bg-light border border-accent px-2 py-1 rounded-lg mt-1">
                                                            {grad.prijevoz} • {grad.trajanje}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {koordinate.length > 0 && (
                                        <div className="flex-1 rounded-xl overflow-hidden border border-accent" style={{minHeight: '300px'}}>
                                            <MapContainer center={[koordinate[0].lat, koordinate[0].lng]} zoom={6} style={{height: '100%', width: '100%'}}>
                                                <FitBounds koordinate={koordinate}/>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                {koordinate.map((k, index) => (
                                                    <Marker key={index} position={[k.lat, k.lng]} icon={customIcon}>
                                                        <Popup>{k.naziv}</Popup>
                                                    </Marker>
                                                ))}
                                                <Polyline positions={koordinate.map(k => [k.lat, k.lng])} color="#6D28D9"/>
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {parseInt(tripDetails.organizator_id) === userId ? (
                                    tripDetails.status === 'active' ? (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap">Requests to join</h3>
                                                <div className="flex-1 h-px bg-accent"/>
                                            </div>
                                            {zahtjevi.length === 0 ? (
                                                <p className="text-accent text-base">No pending requests</p>
                                            ):(
                                                zahtjevi.map(zahtjev => (
                                                <div key={zahtjev.id} className="flex items-center gap-4 mb-3 p-4 bg-surface border border-accent rounded-xl">
                                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                        {zahtjev.ime[0]}{zahtjev.prezime[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p onClick={() => navigate(`/profile/${zahtjev.user_id}`)} className="text-dark font-semibold cursor-pointer hover:text-primary">{zahtjev.ime} {zahtjev.prezime}</p>
                                                        <p className="text-muted text-sm">Wants to join this trip</p>
                                                    </div>
                                                    <button onClick={() => obradiZahtjev(zahtjev.id, 'accepted')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-violet-800">Accept</button>
                                                    <button onClick={() => obradiZahtjev(zahtjev.id, 'rejected')} className="border border-accent text-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary">Reject</button>
                                                </div>
                                                ))
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-accent text-base">This trip is completed.</p>
                                    )
                                ) : jeSudionik ? (
                                    <p className="text-primary font-medium">You are participating in this trip!</p>
                                ) : zahtjevPoslan ? (
                                    <p className="text-primary font-medium">Request sent</p>
                                ) : tripDetails.status === 'active' ? (
                                    <button onClick={async () => {try{await sendRequest(id); setZahtjevPoslan(true);}catch(err){alert(err.response?.data?.error || 'Sorry, you cannot join this trip.');}}} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-violet-800 font-medium w-full">Join</button>
                                ) : null}
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap">Participants</h3>
                                    <div className="flex-1 h-px bg-accent"/>
                                </div>
                                {sudionici.length === 0 ? (
                                    <p className="text-accent text-base">No participants yet</p>
                                ) : (
                                    sudionici.map(sudionik => (
                                        <div key={sudionik.id} className="flex flex-col mb-3">
                                            <div className="flex items-center gap-4 p-4 bg-surface border border-accent rounded-xl">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">{sudionik.ime[0]}</div>
                                                <p onClick={() => navigate(`/profile/${sudionik.id}`)} className="text-dark font-semibold cursor-pointer hover:text-primary flex-1">{sudionik.ime} {sudionik.prezime}</p>
                                                {parseInt(tripDetails.organizator_id) === userId && (
                                                    <div className="flex items-center gap-4 text-sm text-muted">
                                                        <span className="flex items-center gap-1"><Telephone size={14}/>{sudionik.telefon}</span>
                                                        <span className="flex items-center gap-1"><Mail size={14}/>{sudionik.email}</span>
                                                        <button onClick={() => ukloniSudionika(sudionik.id)} className="text-muted hover:text-red-500 flex items-center gap-1"><Trash size={14}/>Remove</button>
                                                    </div>
                                                )}
                                                {ocjenjeniKorisnici.includes(sudionik.id) && (
                                                    <p className="text-muted text-sm">Rated ✓</p>
                                                )}
                                                {tripDetails.status === 'completed' && (jeSudionik || parseInt(tripDetails.organizator_id) === userId) && sudionik.id !== userId && !ocjenjeniKorisnici.includes(sudionik.id) && (
                                                    <button onClick={() => setShowRatingForm(sudionik.id)} className="text-primary text-sm hover:underline flex items-center gap-1"><Star size={16}/>Rate</button>
                                                )}
                                            </div>
                                            {showRatingForm === sudionik.id && (
                                                <div className="mt-2 ml-14 flex gap-2 items-center">
                                                    <select value={ocjena} onChange={(e) => setOcjena(e.target.value)} className="border border-accent rounded px-2 py-1 text-sm">
                                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                    <input value={komentar} onChange={(e) => setKomentar(e.target.value)} placeholder="Comment..." className="border border-accent rounded px-2 py-1 text-sm flex-1"/>
                                                    <button onClick={() => handleOcjenu(sudionik.id)} className="bg-primary text-white px-3 py-1 rounded text-sm">Submit</button>
                                                    <button onClick={() => setShowRatingForm(null)} className="text-accent text-sm">Cancel</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            {jeSudionik && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap">Organiser contact info</h3>
                                        <div className="flex-1 h-px bg-accent"/>
                                    </div>
                                    <p onClick={() => navigate(`/profile/${tripDetails.organizator_id}`)} className="text-dark text-base font-medium cursor-pointer hover:text-primary mb-1">
                                        {tripDetails.org_ime} {tripDetails.org_prezime}
                                    </p>
                                    <p className="text-dark text-base">{tripDetails.org_email}</p>
                                    <p className="text-dark text-base">{tripDetails.org_telefon}</p>
                                </div>
                            )}
                            
                        </div>
                    )
                })()}
            </div>
        </div>
    );
}
export default TripDetails;