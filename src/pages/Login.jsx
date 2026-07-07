import { useState } from "react"
import { login } from "../services/api"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await login(form)
      localStorage.setItem("token", res.data.token)
      
      // Yahan res.data.id ko badalkar res.data.user_id kar diya hai taaki undefined na aaye
      localStorage.setItem("userId", res.data.id)
      
      localStorage.setItem("userName", res.data.name)
      navigate("/dashboard")
    } catch (e) {
      setError(e.response?.data?.detail || "Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"}}>
      <div style={{position:"fixed", top:"10%", left:"10%", width:"300px", height:"300px", background:"rgba(124,58,237,0.15)", borderRadius:"50%", filter:"blur(80px)", animation:"pulse 4s ease-in-out infinite"}}></div>
      <div style={{position:"fixed", bottom:"10%", right:"10%", width:"250px", height:"250px", background:"rgba(37,99,235,0.15)", borderRadius:"50%", filter:"blur(80px)", animation:"pulse 4s ease-in-out infinite 2s"}}></div>

      <div style={{background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"48px", width:"100%", maxWidth:"420px", boxShadow:"0 25px 50px rgba(0,0,0,0.5)"}}>
        <div className="text-center mb-8">
          <div style={{width:"56px", height:"56px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"16px", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", boxShadow:"0 8px 32px rgba(124,58,237,0.4)"}}>🧠</div>
          <h1 style={{color:"white", fontSize:"28px", fontWeight:"700", margin:"0 0 8px"}}>Welcome Back</h1>
          <p style={{color:"rgba(255,255,255,0.5)", margin:0}}>Sign in to StudyMind AI</p>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>
          {["email","password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "email"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({...form, [field]: e.target.value})}
              style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"14px 18px", color:"white", fontSize:"15px", outline:"none", transition:"all 0.3s"}}
              onFocus={(e) => e.target.style.border="1px solid rgba(124,58,237,0.6)"}
              onBlur={(e) => e.target.style.border="1px solid rgba(255,255,255,0.1)"}
            />
          ))}

          {error && <p style={{color:"#f87171", fontSize:"14px", margin:0}}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #2563eb)", border:"none", borderRadius:"12px", padding:"14px", color:"white", fontSize:"16px", fontWeight:"600", cursor: loading ? "not-allowed" : "pointer", transition:"all 0.3s", marginTop:"8px", boxShadow:"0 8px 32px rgba(124,58,237,0.3)"}}
            onMouseEnter={(e) => !loading && (e.target.style.transform="translateY(-2px)", e.target.style.boxShadow="0 12px 40px rgba(124,58,237,0.5)")}
            onMouseLeave={(e) => (e.target.style.transform="translateY(0)", e.target.style.boxShadow="0 8px 32px rgba(124,58,237,0.3)")}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p style={{color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:"24px", fontSize:"14px"}}>
          Don't have an account?{" "}
          <Link to="/signup" style={{color:"#a78bfa", textDecoration:"none", fontWeight:"600"}}>Sign up</Link>
        </p>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }`}</style>
    </div>
  )
}
