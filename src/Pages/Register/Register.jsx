import { Link } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../Firebase/firebase.config";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";


const Register = () => {

    const [registerError, setRegisterError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const name = form.get('name');
        const photo = form.get('photo');
        const email = form.get('email');
        const password = form.get('password');
        const accepted = e.target.terms.checked;

        console.log(name, photo, email, password, accepted);

        // Reset Error
        setRegisterError('');
        setSuccess('');

        if (password.length < 6) {
            setRegisterError('Password must be at least 6 characters or more');
            return;
        }
        else if (!/([A-Z])([a-z])([!#$^&*])/.test(password)) {
            setRegisterError("Password must have at least one uppercase + lowercase and special characters.")
            return;
        }
        else if (!accepted) {
            setRegisterError("You didn't accept our terms and conditions")
            return
        }


        createUserWithEmailAndPassword(auth, email, password)
            .then(res => {
                console.log(res);
                setSuccess('User created successfully!')
            })
            .catch(error => {
                console.error(error);
                setRegisterError(error.message)
            })

    }


    return (
        <div>
            <Navbar></Navbar>
            <div className="hero min-h-[calc(100vh-68px)] bg-base-200">

                <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form onSubmit={handleRegister} className="card-body">
                        <h1 className="text-xl text-center font-semibold my-4">Register your account</h1>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" name="name" placeholder="Enter Your Name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Photo URL</span>
                            </label>
                            <input type="text" name="photo" placeholder="Enter Your Photo URL" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="Enter Your Email" className="input input-bordered" required />
                        </div>
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                className="input input-bordered"
                                required />
                            <span className="absolute bottom-12 right-4" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
                            </span>
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="space-x-2">
                            <input type="checkbox" name="terms" id="terms" />
                            <label htmlFor="terms">
                                Please accept our <a href="">Terms and Conditions</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-neutral">Register</button>
                        </div>

                        <div>
                            {
                                registerError &&
                                <p className="text-red-600 text-center my-4">{registerError}</p>
                            }
                            {
                                success && <p className="text-green-600 text-center my-4">{success}</p>
                            }
                        </div>

                        <div className="my-4 text-center">
                            <p>Already have an account? <Link className="text-blue-500 font-bold" to="/login">Login</Link></p>
                        </div>
                    </form>




                </div>
            </div>
        </div>
    );
};

export default Register;