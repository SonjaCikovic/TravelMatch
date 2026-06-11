import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { uploadImage } from "../api/users";

function Register() {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [datumRodenja, setDatumRodenja] = useState('');
    const [spol, setSpol] = useState('other');
    const [grad, setGrad] = useState('');
    const [tel, setTel] = useState('');
    const [bio, setBio] = useState('');
    const [profilnaSlika, setProfilnaSlika] = useState(null);
    const [greska, setGreska] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const odgovor = await register({
                ime, prezime, email, lozinka, datum_rodenja: datumRodenja, spol, grad, telefon: tel, bio
            });
            console.log(odgovor.data);
            localStorage.setItem('token', odgovor.data.token);
            localStorage.setItem('userId', odgovor.data.korisnik.id);
            if (profilnaSlika) {
                const formData = new FormData();
                formData.append('profilna_slika', profilnaSlika);
                await uploadImage(formData);
            }
            navigate('/trips');
        } catch (err) {
            console.error(err);
            setGreska('Registration failed. Please try again.')
        }finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center pt-10 pb-20 relative" style={{backgroundImage: 'url(/Image3-street.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-surface opacity-30"/>
            <div className="relative z-10 bg-surface/90 p-10 rounded-xl shadow-md w-full max-w-lg">
                <div className="text-center mb-7">
                    <h1 className="font-display text-3xl font-semibold text-primary mb-2">TravelMatch</h1>
                    <p className="text-dark text-base">Register to continue</p>
                </div>
                <div className="mx-auto w-2/3 h-px bg-accent mb-10"></div>
                

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">First Name <span className="text-red-500">*</span></label>
                                <input required
                                    value={ime}
                                    onChange={(e) => setIme(e.target.value)}
                                    placeholder="Enter First Name"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Last Name <span className="text-red-500">*</span></label>
                                <input required
                                    value={prezime}
                                    onChange={(e) => setPrezime(e.target.value)}
                                    placeholder="Enter Last Name"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Email <span className="text-red-500">*</span></label>
                            <input required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Password <span className="text-red-500">*</span></label>
                            <input required
                                value={lozinka}
                                onChange={(e) => setLozinka(e.target.value)}
                                placeholder="Enter Password"
                                type="password"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Date of Birth <span className="text-red-500">*</span></label>
                            <input required
                                value={datumRodenja}
                                onChange={(e) => setDatumRodenja(e.target.value)}
                                placeholder="Enter Date of Birth"
                                type="date"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Gender </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-dark">
                                <input
                                    value="other"
                                    onChange={(e) => setSpol('other')}
                                    type="radio"
                                    checked={spol === 'other'}
                                />
                                Other
                            </label>
                            <label className="flex items-center gap-2 text-dark">
                                <input
                                    value="male"
                                    onChange={(e) => setSpol('male')}
                                    type="radio"
                                    checked={spol === 'male'}
                                />
                                Male
                            </label>
                            <label className="flex items-center gap-2 text-dark">
                                <input
                                    value="female"
                                    onChange={(e) => setSpol('female')}
                                    type="radio"
                                    checked={spol === 'female'}
                                />
                                Female
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">City</label>
                                <input
                                    value={grad}
                                    onChange={(e) => setGrad(e.target.value)}
                                    placeholder="Enter City"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-dark text-base font-medium">Phone Number</label>
                                <input
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    placeholder="Enter Phone Number"
                                    type="tel"
                                    className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                                />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write something about yourself"
                                className="border border-accent rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-primary text-dark w-full"
                            />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-dark text-base font-medium">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilnaSlika(e.target.files[0])}
                            className="border border-accent rounded-lg px-4 py-3 bg-white text-dark w-full"
                        />
                    </div>
                    {greska && <p className="text-red-600 text-sm">{greska}</p>}
                    <button type="submit" className="bg-primary text-white py-3 rounded-lg hover:bg-violet-800 font-medium mt-2">
                        {loading ? 'Signing in' : 'Sign in'}
                    </button>
                </form>
                <p className="text-accent text-sm mt-4">* Required fields</p>
                <p className="text-center text-base text-dark mt-4">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></p>
            </div>
        </div>
    );
}

export default Register;