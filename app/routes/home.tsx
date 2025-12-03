import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect} from "react";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Smart Resume" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}


export default function Home() {
    const {auth} = usePuterStore();
    const navigate = useNavigate();


    useEffect(() =>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated])

  return <main className= "bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
          <div className="page-heading py-16">
              <h1>Track Your Applications And Resume Ratings</h1>
              <h2>Review Your Submissions and Check Ai Powered Feedback.</h2>
          </div>
      </section>

      {resumes.length > 0 && (
          <div className="resumes-section">
              {resumes.map((resume: Resume) => (
                  <ResumeCard key={resume.id} resume={resume}/>
              ))}
          </div>
      )}

  </main>
}
