import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { sendMessage } from "../services/api"

export default function Chat() {
  const { pdfId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setLoading(true)
    try {
      const res = await sendMessage({ user_id: userId, pdf_id: pdfId, message: userMsg })
      setMessages(prev => [...prev, { role: "ai", text: res.data.response }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Try again!" }])
    }
    setLoading(false)
  }

  return (
    <div style={{height:"100vh", display:"flex", flexDirection:"column", background:"linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"}}>

      {/* Background blobs */}
      <div style={{position:"fixed", top:"10%", left:"5%", width:"400px", height:"400px", background:"rgba(124,58,237,0.08)", borderRadius:"50%", filter:"blur(100px)", pointerEvents:"none"}}></div>
      <div style={{position:"fixed", bottom:"10%", right:"5%", width:"300px", height:"300px", background:"rgba(37,99,235,0.08)", borderRadius:"50%", filter:"blur(100px)", pointerEvents:"none"}}></div>

      {/* Navbar */}
      <nav style={{background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0}}>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={{width:"36px", height:"36px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px"}}>🧠</div>
          <span style={{color:"white", fontSize:"20px", fontWeight:"700"}}>StudyMind AI</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"8px 16px", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"14px", transition:"all 0.3s"}}
          onMouseEnter={(e) => e.target.style.background="rgba(255,255,255,0.12)"}
          onMouseLeave={(e) => e.target.style.background="rgba(255,255,255,0.07)"}
        >← Back</button>
      </nav>

      {/* Messages */}
      <div style={{flex:1, overflowY:"auto", padding:"32px 24px", maxWidth:"800px", width:"100%", margin:"0 auto"}}>
        {messages.length === 0 && (
          <div style={{textAlign:"center", paddingTop:"80px"}}>
            <div style={{fontSize:"64px", marginBottom:"16px"}}>💬</div>
            <h2 style={{color:"white", fontSize:"24px", fontWeight:"700", margin:"0 0 8px"}}>Ask anything about your PDF!</h2>
            <p style={{color:"rgba(255,255,255,0.4)"}}>Your AI tutor is ready to help 🚀</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom:"16px", animation:"fadeIn 0.3s ease"}}>
            {msg.role === "ai" && (
              <div style={{width:"32px", height:"32px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", marginRight:"12px", flexShrink:0, marginTop:"4px"}}>🧠</div>
            )}
            <div style={{
              maxWidth:"70%", padding:"14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)",
              border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
              color:"white", fontSize:"15px", lineHeight:"1.6",
              boxShadow: msg.role === "user" ? "0 8px 32px rgba(124,58,237,0.3)" : "none"
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px"}}>
            <div style={{width:"32px", height:"32px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px"}}>🧠</div>
            <div style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px", padding:"14px 18px"}}>
              <div style={{display:"flex", gap:"4px"}}>
                {[0,1,2].map(i => (
                  <div key={i} style={{width:"8px", height:"8px", background:"#7c3aed", borderRadius:"50%", animation:`bounce 1s ease-in-out ${i*0.2}s infinite`}}></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div style={{background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"20px 24px", flexShrink:0}}>
        <div style={{maxWidth:"800px", margin:"0 auto", display:"flex", gap:"12px"}}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your PDF..."
            style={{flex:1, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"14px 18px", color:"white", fontSize:"15px", outline:"none", transition:"all 0.3s"}}
            onFocus={(e) => e.target.style.border="1px solid rgba(124,58,237,0.6)"}
            onBlur={(e) => e.target.style.border="1px solid rgba(255,255,255,0.1)"}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{background:"linear-gradient(135deg, #7c3aed, #2563eb)", border:"none", borderRadius:"14px", padding:"14px 24px", color:"white", fontSize:"20px", cursor: loading ? "not-allowed" : "pointer", transition:"all 0.3s", boxShadow:"0 8px 32px rgba(124,58,237,0.3)"}}
            onMouseEnter={(e) => !loading && (e.target.style.transform="translateY(-2px)", e.target.style.boxShadow="0 12px 40px rgba(124,58,237,0.5)")}
            onMouseLeave={(e) => (e.target.style.transform="translateY(0)", e.target.style.boxShadow="0 8px 32px rgba(124,58,237,0.3)")}
          >→</button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>
    </div>
  )
}
