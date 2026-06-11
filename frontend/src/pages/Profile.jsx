import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyProfile, getUserProfile, updateProfile } from "../api/users";
import Navbar from "../components/Navbar";
import { MapPin, Pencil, Star } from 'lucide-react';
import { getUserRatings } from "../api/ratings";
import { uploadImage } from "../api/users";

function Profile() {
    const {id} = useParams();
    const [myProfileDits, setMyProfileDits] = useState(null);
    const [userProfileDits, setUserProfileDits] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editPodaci, setEditPodaci] = useState({});
    const [prosjekOcjena, setProsjekOcjena] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [ocjene, setOcjene] = useState([]);

    useEffect (() => {
        if (id) {
            const dohvatiUserProfil = async () => {
                try {
                    const odgovor = await getUserProfile(id);
                    setUserProfileDits(odgovor.data);
                    const ocjene = await getUserRatings(id);
                    setProsjekOcjena(ocjene.data.prosjek);
                    setOcjene(ocjene.data.ratings);
                } catch (err) {
                    console.error(err);
                }
            };
            dohvatiUserProfil();
        } else {
            const dohvatiMojProfil = async () => {
                try {
                    const odgovor = await getMyProfile();
                    setMyProfileDits(odgovor.data);
                    const ocjene = await getUserRatings(odgovor.data.id);
                    setProsjekOcjena(ocjene.data.prosjek);
                    setOcjene(ocjene.data.ratings);
                } catch (err) {
                    console.error(err);
                }
            };
            dohvatiMojProfil();
        }
    }, [id]);

    const handleEdit = () => {
        setEditPodaci({
            ime: myProfileDits.ime, prezime: myProfileDits.prezime, grad: myProfileDits.grad, bio: myProfileDits.bio, telefon: myProfileDits.telefon
        });
        setEditMode(true);
    };
    const handleSave = async () => {
        try {
            await updateProfile(editPodaci);
            setMyProfileDits({...myProfileDits, ...editPodaci})
            setEditMode(false);
        } catch (err) {
            console.error(err);
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profilna_slika', file);
            const odgovor = await uploadImage(formData);
            setMyProfileDits({...myProfileDits, profilna_slika: odgovor.data.url});
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light">
            <Navbar/>
            <div className="max-w-4xl mx-auto px-6 py-10">
                {id ? (
                    userProfileDits && (
                        <div className="bg-white border border-accent rounded-xl p-8">
                            <div className="flex items-center gap-6 mb-6"> 
                                {userProfileDits.profilna_slika ? (
                                    <img src={userProfileDits.profilna_slika} alt="Profile" className="w-24 h-24 rounded-full object-cover"/>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-semibold text-primary">
                                        {userProfileDits.ime[0]}{userProfileDits.prezime[0]}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-semibold text-dark mb-1">{userProfileDits.ime} {userProfileDits.prezime}</h2>
                                    <div className="flex items-center gap-4 text-sm text-accent">
                                        {userProfileDits.grad && <span className="flex items-center gap-1"><MapPin size={14} className="text-primary"/>{userProfileDits.grad}</span>}
                                        <span className="flex items-center gap-1"><Star size={14} className="text-primary"/>{prosjekOcjena ? prosjekOcjena : 'No ratings yet'}</span>
                                    </div>
                                </div>
                            </div>
                            {userProfileDits.bio && (
                                <>
                                    <div className="w-full h-px bg-accent mb-6"/>
                                    <h3 className="text-dark font-medium mb-2">About</h3>
                                    <p className="text-dark text-base">{userProfileDits.bio}</p>
                                </>
                            )}
                            {ocjene.length > 0 && (
                                <>
                                    
                                    <h3 className="text-dark font-medium mb-4 mt-5">Reviews</h3>
                                    <div className="flex flex-col gap-3">
                                        {ocjene.map(o => (
                                            <div key={o.id} className="bg-light border border-accent rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-dark font-medium text-sm">{o.ime} {o.prezime}</span>
                                                    <span className="flex items-center gap-1 text-primary text-sm"><Star size={12}/>{o.ocjena}</span>
                                                </div>
                                                {o.komentar && <p className="text-muted text-sm">{o.komentar}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                ) : (
                    myProfileDits && (
                        <div>
                            {editMode ? (
                                <div className="bg-white border border-accent rounded-xl p-8">
                                    <h2 className="text-2xl font-semibold text-dark mb-6">Edit Profile</h2>
                                    <form onSubmit={handleSave} className="flex flex-col gap-5">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-1 flex-1">
                                                <label className="text-dark text-base font-medium">First Name</label>
                                                <input
                                                    value={editPodaci.ime || ''}
                                                    onChange={(e) => setEditPodaci({...editPodaci, ime: e.target.value})}
                                                    placeholder="Enter First Name"
                                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                                />
                                            </div>   
                                            <div className="flex flex-col gap-1 flex-1">
                                                <label className="text-dark text-base font-medium">Last Name</label>
                                                <input
                                                    value={editPodaci.prezime || ''}
                                                    onChange={(e) => setEditPodaci({...editPodaci, prezime: e.target.value})}
                                                    placeholder="Enter Last Name"
                                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                                />
                                            </div>  
                                        </div>  
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">City</label>
                                            <input
                                                value={editPodaci.grad || ''}
                                                onChange={(e) => setEditPodaci({...editPodaci, grad: e.target.value})}
                                                placeholder="Enter City"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>    
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">Bio</label>
                                            <textarea
                                                value={editPodaci.bio || ''}
                                                onChange={(e) => setEditPodaci({...editPodaci, bio: e.target.value})}
                                                placeholder="Enter Bio"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>    
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-dark text-base font-medium">Phone Number</label>
                                            <input
                                                value={editPodaci.telefon || ''}
                                                onChange={(e) => setEditPodaci({...editPodaci, telefon: e.target.value})}
                                                placeholder="Enter Phone Number"
                                                type="tel"
                                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button type="submit" className="bg-primary text-white py-3 rounded-lg hover:bg-violet-800 font-medium text-base flex-1">Save</button>
                                            <button type="button" onClick={() => setEditMode(false)} className="border-2 border-primary text-primary py-3 rounded-lg hover:bg-secondary hover:text-violet-800 hover:border-violet-800 font-medium text-base flex-1">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-white border border-accent rounded-xl p-8 relative">
                                    <button onClick={handleEdit} className="absolute top-4 right-4 text-primary text-base font-medium hover:underline flex items-center gap-1"><Pencil size={16}/> Edit</button>

                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="relative">
                                            {myProfileDits.profilna_slika ? (
                                                <img src={myProfileDits.profilna_slika} alt="Profile" className="w-24 h-24 rounded-full object-cover"/>
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-semibold text-primary">
                                                    {myProfileDits.ime[0]}{myProfileDits.prezime[0]}
                                                </div> 
                                            )}
                                            <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-violet-800">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                                                <Pencil size={12}/>
                                            </label>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-semibold text-dark">{myProfileDits.ime} {myProfileDits.prezime}</h2>
                                            <div className="flex items-center gap-4 text-sm text-accent">
                                                {myProfileDits.grad && <span className="flex items-center gap-1"><MapPin size={14} className="text-primary"/>{myProfileDits.grad}</span>}
                                                <span className="flex items-center gap-1"><Star size={14} className="text-primary"/>{prosjekOcjena ? prosjekOcjena : 'No ratings yet'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {myProfileDits.bio && (
                                        <>
                                            <div className="w-full h-px bg-accent mb-6"/>
                                            <h3 className="text-dark font-medium mb-2">About</h3>
                                            <p className="text-dark text-base">{myProfileDits.bio}</p>
                                        </>
                                    )}
                                    {ocjene.length > 0 && (
                                        <>ž
                                            <h3 className="text-dark font-medium mb-4 mt-5">Reviews</h3>
                                            <div className="flex flex-col gap-3">
                                                {ocjene.map(o => (
                                                    <div key={o.id} className="bg-light border border-accent rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-dark font-medium text-sm">{o.ime} {o.prezime}</span>
                                                            <span className="flex items-center gap-1 text-primary text-sm"><Star size={12}/>{o.ocjena}</span>
                                                        </div>
                                                        {o.komentar && <p className="text-muted text-sm">{o.komentar}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
export default Profile;