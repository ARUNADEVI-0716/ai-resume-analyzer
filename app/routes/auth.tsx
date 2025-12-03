import React, {use, useEffect} from 'react';
import {usePuterStore} from "~/lib/puter";
import {useLocation,useNavigate} from "react-router"
export const meta = () => ([
    { title: 'Smart Resume | Auth'},
    { name : 'description', content : 'Log into your account'},
])
const Auth = () => {
   const {isLoading , auth} = usePuterStore();
   const location = useLocation();
   const next = location.search.split('next=')[1];
   const navigate = useNavigate();


   useEffect(() =>{
       if(auth.isAuthenticated) navigate(next);
       },[auth.isAuthenticated,next])
    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center l">
             <div className="gradient-border shadow-lg">
                 <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                     <div className="flex flex-col items-center gap-2 text-counter">
                         <h1>Welcome !</h1>
                         <h2>Log In- Your Dream Job Is One Step Closer </h2>
                     </div>
                     <div>
                         {isLoading ? (
                             <button className="auth-button animate-pulse">
                                 <p>Signing you in...</p>
                             </button>
                         ):(
                             <>
                                 {auth.isAuthenticated ? (
                                     <button className="auth-button" onClick={auth.signOut}>
                                         <p>Log Out</p>
                                     </button>
                                 ):(
                                     <button className="auth-button" onClick={auth.signIn}>
                                         <p>Log In</p>
                                     </button>
                                 )}
                             </>
                         )}
                     </div>
                  </section>
             </div>
        </main>
    )

}
export default Auth;