import Navbar from "../components/navbar"
import First from "../components/first"
import About from "../components/features"
import Quiz from "../components/quiz"
import Timer from "../components/timer"

export default function Home() {
  return (
 <>

  <Navbar/>
  <First/>
  <About/>
  <div className="quiz bg-blue-400">

  <Quiz/>
  </div>
  <Timer/>
    
  <footer>
        <p>© {new Date().getFullYear()} ExamACE</p>
      </footer>
 </>
  );
}
