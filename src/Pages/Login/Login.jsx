import { Link } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa6";
import { GithubAuthProvider, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useRef, useState } from "react";
import auth from "../../Firebase/firebase.config";

const Login = () => {

    const [user, setUser] = useState(null)
    const [loginError, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);



    const emailRef = useRef(null)

    const googleProvider = new GoogleAuthProvider();
    const gitHubProvider = new GithubAuthProvider();

    const handleLogIn = e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get('email');
        const password = form.get('password')
        console.log(email, password);

        setError('');
        setSuccess('');

        signInWithEmailAndPassword(auth, email, password)
            .then(res => {
                const loggedIn = res.user;
                console.log("Logged in user: ", loggedIn);
                setUser(loggedIn)
                setSuccess('User successfully logged in');
            })
            .catch(error => {
                setError(error.message)
            })


    }

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(res => {
                const googleUser = res.user
                console.log("Google mama is coming: ", googleUser);
                setUser(googleUser);
                setSuccess('User successfully logged in');
            })
            .catch(error => {
                console.error(error);
                setError(error.message)
            })
    };

    const handleGithubSignIn = () => {
        signInWithPopup(auth, gitHubProvider)
            .then(res => {
                const githubUser = res.user;
                console.log("Github user: ", githubUser);
                setUser(githubUser)
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleSignOut = () => [
        signOut(auth)
            .then(() => {

                setUser(null);

            })
            .catch(error => {
                console.error(error);
            })
    ]

    const handleForgetPassword = () => {
        const email = emailRef.current.value;

        if (!email) {
            alert('Please Provide an email address.', email);
            return;
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please write a valid email address!');
            return;
        }


        // send validation email
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Please Check your email')
            })
            .catch(error => {
                console.error(error.message)
            })
    }




    return (
        <div>
            <Navbar></Navbar>
            <div>

                {
                    user && <div className="text-center py-10 space-y-3 bg-slate-300">

                        <img className="mx-auto rounded-full" src={user.photoURL} alt="" />
                        <h3 className="text-2xl font-semibold">{user.displayName}</h3>
                        <p className="font-extrabold">{user.email}</p>

                    </div>
                }

            </div>
            <div className="hero min-h-[calc(100vh-68px)] bg-base-200">

                <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form onSubmit={handleLogIn} className="card-body">
                        <h1 className="text-xl text-center font-semibold my-4">Login your account</h1>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                ref={emailRef}
                                placeholder="Enter Your Email"
                                className="input input-bordered"
                                required />
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
                            <span className="absolute bottom-12 right-4" onClick={() => setShowPassword(!showPassword)} >{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
                            <label className="label">
                                <a onClick={handleForgetPassword}
                                    href="#"
                                    className="label-text-alt link link-hover">
                                    Forgot password?
                                </a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-neutral">Login</button>
                        </div>
                        <div className="my-4 text-center">
                            <p>Already have an account? <Link className="text-green-500 font-bold" to="/register">Register</Link></p>
                        </div>
                        <div className="form-control mt-6">

                            {
                                user ? <button onClick={handleSignOut} className="btn btn-neutral mb-4">
                                    Sign out
                                </button>
                                    :
                                    <>
                                        <button onClick={handleGoogleSignIn} className="btn btn-neutral mb-4">
                                            <FaGoogle></FaGoogle>
                                            Google
                                        </button>
                                        <button onClick={handleGithubSignIn} className="btn btn-neutral mb-4">
                                            <FaGithub></FaGithub>
                                            Github
                                        </button>
                                        <button onClick={handleGithubSignIn} className="btn btn-neutral">
                                            <FaTwitter></FaTwitter>
                                            Twitter
                                        </button>
                                    </>
                            }

                        </div>
                        <div>
                            {
                                user && <p className="text-green-600 text-center my-4">{success}</p>
                            }
                            {
                                loginError && <p className="text-red-600 text-center my-4">{loginError}</p>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;