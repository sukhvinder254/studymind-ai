import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export default function Quiz() {
  const { pdfId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const generateQuiz = async () => {
    setLoading(true)
    setSubmitted(false)
    setSelected({})
    try {
      const res = await axios.post("http://127.0.0.1:8000/quiz/generate", { pdf_id: pdfId })
      setQuestions(res.data.questions)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, i) => {
      if (selected[i] === q.answer) correct++
    })
    setScore(correct)
    setSubmitted(true)
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"}}>
      <div style={{position:"fixed", top:"10%", left:"5%", width:"400px", height:"400px", background:"rgba(124,58,237,0.08)", borderRadius:"50%", filter:"blur(100px)", pointerEvents:"none"}}></div>

      <nav style={{background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"fixed", top:0, left:0, right:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={{width:"36px", height:"36px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px"}}>🧠</div>
          <span style={{color:"white", fontSize:"20px", fontWeight:"700"}}>StudyMind AI</span>
        </div>
        <button
          onClick={() => navigate(`/chat/${pdfId}`)}
          style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"8px 16px", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"14px"}}
        >← Back to Chat</button>
      </nav>

      <div style={{maxWidth:"800px", margin:"0 auto", padding:"100px 24px 40px"}}>
        <div style={{textAlign:"center", marginBottom:"40px"}}>
          <h1 style={{color:"white", fontSize:"32px", fontWeight:"700", margin:"0 0 8px"}}>🧠 Quiz Generator</h1>
          <p style={{color:"rgba(255,255,255,0.5)"}}>Test your knowledge from the PDF</p>
        </div>

        {questions.length === 0 && (
          <div style={{textAlign:"center", padding:"60px 0"}}>
            <div style={{fontSize:"64px", marginBottom:"24px"}}>📝</div>
            <button
              onClick={generateQuiz}
              disabled={loading}
              style={{background:"linear-gradient(135deg, #7c3aed, #2563eb)", border:"none", borderRadius:"14px", padding:"16px 40px", color:"white", fontSize:"18px", fontWeight:"600", cursor:"pointer", boxShadow:"0 8px 32px rgba(124,58,237,0.3)"}}
            >
              {loading ? "Generating Quiz..." : "Generate Quiz ✨"}
            </button>
          </div>
        )}

        {questions.length > 0 && (
          <div>
            {questions.map((q, i) => (
              <div key={i} style={{background:"rgba(255,255,255,0.05)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"24px", marginBottom:"20px"}}>
                <p style={{color:"white", fontSize:"17px", fontWeight:"600", margin:"0 0 16px"}}>Q{i+1}. {q.question}</p>
                <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                  {q.options && q.options.map((opt, j) => {
                    let bg = "rgba(255,255,255,0.05)"
                    let border = "1px solid rgba(255,255,255,0.1)"
                    if (submitted) {
                      if (opt === q.answer) { bg = "rgba(34,197,94,0.2)"; border = "1px solid #22c55e" }
                      else if (opt === selected[i] && opt !== q.answer) { bg = "rgba(239,68,68,0.2)"; border = "1px solid #ef4444" }
                    } else if (selected[i] === opt) {
                      bg = "rgba(124,58,237,0.3)"; border = "1px solid #7c3aed"
                    }
                    return (
                      <div
                        key={j}
                        onClick={() => !submitted && setSelected({...selected, [i]: opt})}
                        style={{background:bg, border, borderRadius:"10px", padding:"12px 16px", color:"white", cursor: submitted ? "default" : "pointer", transition:"all 0.2s"}}
                      >
                        {opt}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                style={{width:"100%", background:"linear-gradient(135deg, #7c3aed, #2563eb)", border:"none", borderRadius:"14px", padding:"16px", color:"white", fontSize:"16px", fontWeight:"600", cursor:"pointer", marginTop:"8px"}}
              >Submit Quiz</button>
            ) : (
              <div style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"32px", textAlign:"center", marginTop:"20px"}}>
                <div style={{fontSize:"48px", marginBottom:"16px"}}>{score === questions.length ? "🏆" : score >= 3 ? "🎉" : "📚"}</div>
                <h2 style={{color:"white", fontSize:"28px", fontWeight:"700", margin:"0 0 8px"}}>Score: {score}/{questions.length}</h2>
                <p style={{color:"rgba(255,255,255,0.5)", margin:"0 0 24px"}}>{score === questions.length ? "Perfect score!" : score >= 3 ? "Great job!" : "Keep studying!"}</p>
                <button
                  onClick={generateQuiz}
                  style={{background:"linear-gradient(135deg, #7c3aed, #2563eb)", border:"none", borderRadius:"12px", padding:"12px 32px", color:"white", fontSize:"15px", fontWeight:"600", cursor:"pointer"}}
                >Try Again ↺</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
