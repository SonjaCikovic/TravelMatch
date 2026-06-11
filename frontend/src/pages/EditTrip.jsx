import { useEffect, useState } from "react";
import { addCity, getTrip, updateTrip, deleteCities } from "../api/trips";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Trash } from "lucide-react";

function EditTrip() {
    const [naslov, setNaslov] = useState('');
    const [opis, setOpis] = useState('');
    const [postaja, setPostaja] = useState([{naziv: '', prijevoz: '', trajanje: ''}]);
    const [datumPolaska, setDatumPolaska] = useState('');
    const [datumPovratka, setDatumPovratka] = useState('');
    const [kategorija, setKategorija] = useState('');
    const [budzet, setbudzet] = useState('');
    const [tipSmjestaja, setTipSmjestaja] = useState('');
    const [nazivSmjestaja, setNazivSmjestaja] = useState('');
    const [tipOrganizacije, setTipOrganizacije] = useState('');
    const [maxSudionika, setMaxSudionika] = useState('');
    const [dozvoljenSpol, setDozvoljenSpol] = useState('all');
    const [minDob, setMinDob] = useState('');
    const [maxDob, setMaxDob] = useState('');
    const {id} = useParams();
    const navigate = useNavigate();
    const dodajPostaju = () => {
        setPostaja([...postaja, {naziv: '', prijevoz: '', trajanje: ''}])
    };
    const promjeniPostaju = (index, polje, vrijednost) => {
        const novaPostaja = [...postaja];
        novaPostaja[index][polje] = vrijednost;
        setPostaja(novaPostaja);
    };

    useEffect(() => {
        const dohvatiTrip = async () => {
            try {
                const odgovor = await getTrip(id);
                const trip = odgovor.data;
                setNaslov(trip.naslov || '');
                setOpis(trip.opis || '');
                setDatumPolaska(trip.datum_polaska?.split('T')[0] || '');
                setDatumPovratka(trip.datum_povratka?.split('T')[0] || '');
                setKategorija(trip.kategorija || '');
                setbudzet(trip.budzet || '');
                setTipSmjestaja(trip.tip_smjestaja || '');
                setTipOrganizacije(trip.tip_organizacije || '');
                setMaxSudionika(trip.max_sudionici || '');
                setDozvoljenSpol(trip.dozvoljeni_spol || 'all');
                setMinDob(trip.minimalna_dob || '');
                setMaxDob(trip.maksimalna_dob || '');
                if (trip.gradovi && trip.gradovi.length > 0) {
                    setPostaja(trip.gradovi.map(g => ({
                        naziv: g.grad, prijevoz: g.prijevoz || '', trajanje: g.trajanje || ''
                    })));
                }
            } catch (err) {
                console.error(err);
            }
        };
        dohvatiTrip();
    }, [id]);

    const handleEditTrip = async (e) => {
        e.preventDefault();
        try {
            if (postaja[0].naziv === '') {
                alert('Please enter at least one destination!');
                return;
            }
            if (new Date(datumPolaska) < new Date()) {
                alert('Departure date cannot be in the past!');
                return;
            }
            const odgovor = await updateTrip(id, {
                            naslov, opis, pocetni_grad: postaja[0].naziv, zavrsni_grad: postaja[postaja.length - 1].naziv, datum_polaska: datumPolaska, datum_povratka: datumPovratka,
                            kategorija, budzet: budzet||null, tip_smjestaja: tipSmjestaja, tip_organizacije: tipOrganizacije, max_sudionici: maxSudionika||null, dozvoljeni_spol: dozvoljenSpol,
                            minimalna_dob: minDob||null, maksimalna_dob: maxDob||null
            });
            await deleteCities(id);
            for (let i=0; i<postaja.length; i++){
                await addCity(id, {
                    grad: postaja[i].naziv, redoslijed: i+1, prijevoz: postaja[i].prijevoz, trajanje: postaja[i].trajanje
                });
            }
            navigate('/my-trips');
        } catch (err) {
            console.error(err);
        }
    };

    const obrisiPostaju = (index) => {
        setPostaja(postaja.filter((_, i) => i !== index));
    };

    return(
        <div className="min-h-screen bg-light">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 pt-8 pb-20">
                <h2 className="text-2xl font-semibold text-dark mb-6">Edit Your Trip</h2>
                <div className="bg-surface rounded-xl shadow-md p-8">
                    <form onSubmit={handleEditTrip} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Title <span className="text-red-500">*</span></label>
                            <input required
                                value={naslov}
                                onChange={(e) => setNaslov(e.target.value)}
                                placeholder="Enter Trip's Title"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Description</label>  
                            <textarea 
                                value={opis}
                                onChange={(e) => setOpis(e.target.value)}
                                placeholder="Write Short Description"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <h3 className="text-lg font-semibold text-dark mb-4">Route</h3>
                            {postaja.map((p, index) => (
                                <div key={index} className="border border-accent rounded-lg p-3 flex flex-col gap-3 mb-2 relative">
                                    <button type="button" onClick={() => obrisiPostaju(index)} className="absolute top-2 right-2 text-primary hover:text-violet-800 flex items-center gap-1"><Trash size={16}/>Delete</button>
                                    <div className="flex gap-4 pt-4">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">Destination</label>
                                            <input
                                                value={p.naziv}
                                                onChange={(e) => promjeniPostaju(index, 'naziv', e.target.value)}
                                                placeholder="Enter Destination Name"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">Transport</label>
                                            <input
                                                value={p.prijevoz}
                                                onChange={(e) => promjeniPostaju(index, 'prijevoz', e.target.value)}
                                                placeholder="Enter Transport Type"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">Duration</label>
                                            <input
                                                value={p.trajanje}
                                                onChange={(e) => promjeniPostaju(index, 'trajanje', e.target.value)}
                                                placeholder="Enter Duration"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={dodajPostaju} className="border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-secondary text-base font-semibold mt-2">+ Add Stop</button>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-dark text-base font-medium">Departure Date <span className="text-red-500">*</span></label>  
                                <input required
                                    value={datumPolaska}
                                    onChange={(e) => setDatumPolaska(e.target.value)}
                                    placeholder="Enter Departure Date"
                                    type="date"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-dark text-base font-medium">Return Date <span className="text-red-500">*</span></label>  
                                <input required
                                    value={datumPovratka} //obavezno ali ponuditi oznaku za promjenjivo
                                    onChange={(e) => setDatumPovratka(e.target.value)}
                                    placeholder="Enter Arrival Date"
                                    type="date"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Category <span className="text-red-500">*</span></label>
                            <select required
                                value={kategorija}
                                onChange={(e) => setKategorija(e.target.value)}
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            >
                                <option value="">Choose Category</option>
                                <option value="adventure">Adventure</option> 
                                <option value="cultural">Cultural</option>
                                <option value="relaxation">Relaxation</option>
                                <option value="sport">Sport</option>
                                <option value="wellness">Wellness</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Allowed gender</label>
                            <select 
                                value={dozvoljenSpol}
                                onChange={(e) => setDozvoljenSpol(e.target.value)}
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            >
                                <option value="all">All</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Budget</label>  
                            <input
                                value={budzet} //kod prikaza putovanja budzet prikazati u obliku $ ili $$ ili $$$ a onda u detaljima točnu brojku
                                onChange={(e) => setbudzet(e.target.value)}
                                placeholder="Enter Budget"
                                type="number"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            /> 
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Accommodation</label>  
                            <select 
                                value={tipSmjestaja}
                                onChange={(e) => setTipSmjestaja(e.target.value)}
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            >
                                <option value="">Choose Accommodation Type</option>
                                <option value="hotel">Hotel</option>
                                <option value="hostel">Hostel</option>
                                <option value="apartment">Apartment</option>
                                <option value="room">Room</option>
                                <option value="camp">Camp</option>
                                <option value="other">Other</option> 
                            </select>
                            {tipSmjestaja !== "" && (<input value={nazivSmjestaja} onChange={(e) => setNazivSmjestaja(e.target.value)} placeholder="Enter Accommodation Name" className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full mt-2"/>)}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Organisation</label>
                            <select 
                                value={tipOrganizacije}
                                onChange={(e) => setTipOrganizacije(e.target.value)}
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            >
                                <option value="">Choose Organisation Type</option>
                                <option value="private">Private</option>
                                <option value="agency">Agency</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Number of Participants</label> 
                            <input
                                value={maxSudionika}
                                onChange={(e) => setMaxSudionika(e.target.value)}
                                placeholder="Enter Maximum Number of Participants"
                                type="number"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            /> 
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Allowed Age Range</label> 
                            <div className="flex gap-4">
                                <input
                                    value={minDob}
                                    onChange={(e) => setMinDob(e.target.value)}
                                    placeholder="Enter Minimum Age of Participants"
                                    type="number"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full flex-1"
                                />
                                <input
                                    value={maxDob}
                                    onChange={(e) => setMaxDob(e.target.value)}
                                    placeholder="Enter Maximum Age of Participants"
                                    type="number"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full flex-1"
                                /> 
                                
                            </div>
                        </div>
                        <button type="submit" className="bg-primary text-white py-3 rounded-lg hover:bg-violet-800 font-medium mt-2">Update Trip</button>
                    </form>
                    <p className="text-accent text-sm mt-4">* Required fields</p>
                </div>
            </div>
        </div>
    );
}

export default EditTrip;