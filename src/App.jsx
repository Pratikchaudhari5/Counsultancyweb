import { useState, useEffect, useRef } from "react";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const COLORS = {
  navy: "#0A1628",
  blue: "#1A56DB",
  blueLight: "#3B82F6",
  bluePale: "#EFF6FF",
  gold: "#F59E0B",
  goldLight: "#FEF3C7",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray800: "#1F2937",
  green: "#10B981",
  greenLight: "#ECFDF5",
};

const style = (obj) => obj;

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html { scroll-behavior: smooth; }
  
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    color: #1F2937;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: #1A56DB; border-radius: 3px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-fadeInUp { animation: fadeInUp 0.7s ease forwards; }
  .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pulse { animation: pulse 2s ease-in-out infinite; }

  .section-visible { animation: fadeInUp 0.8s ease forwards; }

  .btn-primary {
    background: linear-gradient(135deg, #1A56DB, #3B82F6);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(26,86,219,0.35);
    letter-spacing: 0.3px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(26,86,219,0.5);
    background: linear-gradient(135deg, #1547c0, #2563eb);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255,255,255,0.7);
    padding: 13px 32px;
    border-radius: 50px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-secondary:hover {
    background: white;
    color: #1A56DB;
    border-color: white;
    transform: translateY(-2px);
  }

  .btn-gold {
    background: linear-gradient(135deg, #F59E0B, #FBBF24);
    color: #1F2937;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(245,158,11,0.4);
  }
  .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(245,158,11,0.55);
  }

  .card-hover {
    transition: all 0.35s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
  }

  .nav-link {
    color: #1F2937;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    padding: 6px 0;
    position: relative;
    transition: color 0.2s;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #1A56DB;
    transition: width 0.3s ease;
  }
  .nav-link:hover { color: #1A56DB; }
  .nav-link:hover::after { width: 100%; }

  .gradient-text {
    background: linear-gradient(135deg, #1A56DB, #3B82F6, #0EA5E9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #EFF6FF;
    color: #1A56DB;
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }

  .input-field {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: #1F2937;
    background: #F9FAFB;
    transition: all 0.2s;
    outline: none;
  }
  .input-field:focus {
    border-color: #1A56DB;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
  }

  .whatsapp-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 60px;
    height: 60px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 24px rgba(37,211,102,0.5);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
    text-decoration: none;
    animation: float 3s ease-in-out infinite;
  }
  .whatsapp-btn:hover {
    transform: scale(1.12);
    box-shadow: 0 10px 32px rgba(37,211,102,0.65);
  }

  .trust-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 10px 18px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    color: white;
  }

  .stat-card {
    text-align: center;
    padding: 28px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    transition: all 0.3s ease;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(26,86,219,0.15);
  }

  .college-card {
    background: white;
    border: 1.5px solid #E5E7EB;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .college-card:hover {
    border-color: #1A56DB;
    box-shadow: 0 8px 32px rgba(26,86,219,0.12);
    transform: translateY(-3px);
  }

  .testimonial-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    position: relative;
    transition: all 0.3s ease;
  }
  .testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  }

  .step-card {
    text-align: center;
    padding: 36px 24px;
    position: relative;
  }

  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,22,40,0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
    padding: 20px;
  }
  .popup-box {
    background: white;
    border-radius: 24px;
    padding: 40px;
    max-width: 480px;
    width: 100%;
    position: relative;
    animation: fadeInUp 0.4s ease;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
  }

  @media (max-width: 768px) {
    .hero-title { font-size: 36px !important; }
    .section-title { font-size: 28px !important; }
    .hide-mobile { display: none !important; }
    .mobile-stack { flex-direction: column !important; }
    .mobile-full { width: 100% !important; }
    .nav-links-desktop { display: none !important; }
    .popup-box { padding: 28px 24px; }
    .hero-badges { flex-wrap: wrap; }
  }
`;

const colleges = [
  { name: "Symbiosis International University", location: "Pune", logo: "SIU", color: "#1A56DB", programs: "MBA, Law, Engineering" },
  { name: "Amity University", location: "Noida", logo: "AU", color: "#10B981", programs: "BBA, MBA, Tech" },
  { name: "Lovely Professional University", location: "Punjab", logo: "LPU", color: "#F59E0B", programs: "Engineering, MBA, Design" },
  { name: "MIT World Peace University", location: "Pune", logo: "MIT", color: "#8B5CF6", programs: "Engineering, MBA, Pharma" },
  { name: "Manipal University", location: "Manipal", logo: "MU", color: "#EF4444", programs: "Medicine, Engineering, MBA" },
  { name: "Christ University", location: "Bangalore", logo: "CU", color: "#06B6D4", programs: "Commerce, Arts, Management" },
  { name: "UPES", location: "Dehradun", logo: "UPES", color: "#F97316", programs: "Energy, Law, Engineering" },
  { name: "Sharda University", location: "Greater Noida", logo: "SU", color: "#EC4899", programs: "All Programs" },
];

const services = [
  {
    icon: "🎯",
    title: "Career Counselling",
    desc: "Expert one-on-one sessions to identify your strengths, interests, and the perfect career path aligned with your ambitions.",
    badge: "Free First Session",
  },
  {
    icon: "🏫",
    title: "Direct College Admission",
    desc: "Skip the uncertainty. We secure confirmed seats in top partner colleges through our exclusive tie-ups and direct admission channels.",
    badge: "Guaranteed Seats",
  },
  {
    icon: "📝",
    title: "Application & Documentation",
    desc: "End-to-end assistance with applications, SOPs, recommendation letters, and all required documentation handled by experts.",
    badge: "Error-Free Process",
  },
  {
    icon: "💰",
    title: "Scholarship Guidance",
    desc: "We identify and apply for merit and need-based scholarships to make quality education financially accessible for every student.",
    badge: "Upto ₹2L Savings",
  },
  {
    icon: "🌍",
    title: "Study Abroad Assistance",
    desc: "From shortlisting universities to visa support, we guide you every step of the way for international education opportunities.",
    badge: "20+ Countries",
  },
  {
    icon: "📊",
    title: "Entrance Exam Coaching",
    desc: "Structured preparation for CAT, CLAT, JEE, NEET, CUET and more with expert mentors and proven study strategies.",
    badge: "98% Pass Rate",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    college: "Symbiosis Law School, Pune",
    text: "EduReach made my dream of studying at Symbiosis a reality! The team guided me through every step — from the application to the final admission letter. Absolutely outstanding support!",
    rating: 5,
    avatar: "PS",
    program: "BA LLB",
  },
  {
    name: "Rahul Mehta",
    college: "Amity University, Noida",
    text: "I was confused about which MBA program to choose. The career counselling session completely changed my perspective. I got into my dream college with a merit scholarship — couldn't be happier!",
    rating: 5,
    avatar: "RM",
    program: "MBA Finance",
  },
  {
    name: "Anjali Patel",
    college: "Manipal University",
    text: "Getting MBBS admission seemed impossible until EduReach stepped in. Their college tie-ups and direct admission process saved us so much time and stress. Highly recommend!",
    rating: 5,
    avatar: "AP",
    program: "MBBS",
  },
  {
    name: "Karthik Nair",
    college: "LPU, Punjab",
    text: "The team is incredibly responsive and knowledgeable. They helped me compare multiple engineering colleges, secure a scholarship, and complete all documentation in record time!",
    rating: 5,
    avatar: "KN",
    program: "B.Tech CSE",
  },
  {
    name: "Sanya Gupta",
    college: "Christ University, Bangalore",
    text: "First-generation college student here. EduReach treated my family with respect and made the whole process transparent and stress-free. They are truly invested in your success!",
    rating: 5,
    avatar: "SG",
    program: "B.Com Hons",
  },
  {
    name: "Arjun Verma",
    college: "UPES, Dehradun",
    text: "Tried multiple consultancies before finding EduReach. The difference is night and day — honest advice, real college connections, and zero hidden fees. Got my admit in 10 days!",
    rating: 5,
    avatar: "AV",
    program: "B.Tech Petroleum",
  },
];

const steps = [
  { num: "01", icon: "📞", title: "Free Consultation", desc: "Book a free session with our expert counsellors to discuss your goals, academic background, and aspirations." },
  { num: "02", icon: "🎯", title: "College Shortlisting", desc: "We analyse your profile and shortlist the best-fit colleges from our 50+ partner network based on your goals." },
  { num: "03", icon: "📋", title: "Application Support", desc: "Our team handles your complete application — forms, SOPs, documents, and submissions on your behalf." },
  { num: "04", icon: "✅", title: "Confirmed Admission", desc: "Receive your official admission letter and get ready for the next exciting chapter of your life!" },
];

const trustBadges = [
  { icon: "🏆", label: "10,000+ Students Placed" },
  { icon: "🎓", label: "50+ Partner Colleges" },
  { icon: "⭐", label: "4.9/5 Google Rating" },
  { icon: "🔒", label: "100% Transparent Process" },
];

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#F59E0B", fontSize: "16px" }}>★</span>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display: "inline-block",
      width: "18px", height: "18px",
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      marginRight: "8px",
    }} />
  );
}

export default function App() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDone, setPopupDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", course: "" });
  const [submitting, setSubmitting] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", course: "", message: "" });
  const [contactDone, setContactDone] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  const ADMIN_PASSWORD = "edureach2024";

  useEffect(() => {
    const timer = setTimeout(() => setPopupOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("edureach_leads");
    if (saved) setLeads(JSON.parse(saved));
  }, []);

  const saveLead = (data) => {
    const lead = { ...data, timestamp: new Date().toISOString(), id: Date.now() };
    const updated = [lead, ...leads];
    setLeads(updated);
    localStorage.setItem("edureach_leads", JSON.stringify(updated));
  };

  const handlePopupSubmit = async () => {
    if (!form.name || !form.phone || !form.email) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    saveLead({ ...form, source: "popup" });
    setSubmitting(false);
    setPopupDone(true);
  };

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.phone || !contactForm.email) return;
    setContactSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    saveLead({ ...contactForm, source: "contact_form" });
    setContactSubmitting(false);
    setContactDone(true);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{globalStyles}</style>

      {/* POPUP */}
      {popupOpen && (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && setPopupOpen(false)}>
          <div className="popup-box">
            <button onClick={() => setPopupOpen(false)} style={{
              position: "absolute", top: "16px", right: "20px",
              background: "#F3F4F6", border: "none", borderRadius: "50%",
              width: "32px", height: "32px", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
            }}>×</button>

            {!popupDone ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎓</div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#0A1628", marginBottom: "8px" }}>
                    Get Free Career Counselling
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: "1.6" }}>
                    Talk to an expert today. Limited free slots available — book yours now!
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <input className="input-field" placeholder="Full Name *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input className="input-field" placeholder="Phone Number *" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <input className="input-field" type="email" placeholder="Email Address *" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                  <select className="input-field" value={form.course}
                    onChange={e => setForm({ ...form, course: e.target.value })}
                    style={{ cursor: "pointer" }}>
                    <option value="">Interested Course / Stream</option>
                    <option>Engineering / B.Tech</option>
                    <option>MBA / Management</option>
                    <option>Medical / MBBS / BDS</option>
                    <option>Law / LLB</option>
                    <option>Design / Architecture</option>
                    <option>Commerce / BBA / B.Com</option>
                    <option>Arts / Humanities</option>
                    <option>Study Abroad</option>
                    <option>Other</option>
                  </select>
                  <button className="btn-primary" onClick={handlePopupSubmit}
                    disabled={submitting || !form.name || !form.phone || !form.email}
                    style={{ width: "100%", padding: "15px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {submitting && <Spinner />}
                    {submitting ? "Submitting..." : "🚀 Get Free Counselling Now"}
                  </button>
                </div>
                <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "14px" }}>
                  🔒 Your information is 100% secure and confidential
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#0A1628", marginBottom: "12px" }}>
                  Thank You!
                </h3>
                <p style={{ color: "#10B981", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                  Your request has been received successfully.
                </p>
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: "1.7" }}>
                  Our expert counsellor will call you within <strong>2–4 hours</strong> during business hours. Get ready to take the next step in your academic journey!
                </p>
                <button className="btn-primary" onClick={() => setPopupOpen(false)}
                  style={{ marginTop: "24px" }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
      {showAdminPanel && (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdminPanel(false)}>
          <div style={{
            background: "#0A1628", borderRadius: "20px", padding: "32px",
            width: "min(95vw, 900px)", maxHeight: "85vh", overflowY: "auto",
            animation: "fadeInUp 0.4s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ color: "white", fontSize: "22px", fontFamily: "'Playfair Display', serif" }}>
                📊 Lead Management Dashboard
              </h2>
              <button onClick={() => setShowAdminPanel(false)} style={{
                background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px",
              }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Total Leads", value: leads.length, color: "#3B82F6" },
                { label: "Popup Leads", value: leads.filter(l => l.source === "popup").length, color: "#10B981" },
                { label: "Contact Form", value: leads.filter(l => l.source === "contact_form").length, color: "#F59E0B" },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px",
                  textAlign: "center", border: `1px solid ${stat.color}33`,
                }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "4px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
            {leads.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6B7280", padding: "40px" }}>
                No leads yet. Submit the popup form to test!
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.1)" }}>
                      {["#", "Name", "Phone", "Email", "Course", "Source", "Date/Time"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", color: "#9CA3AF", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <td style={{ padding: "12px 14px", color: "#6B7280" }}>{i + 1}</td>
                        <td style={{ padding: "12px 14px", color: "white", fontWeight: 600 }}>{lead.name}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <a href={`tel:${lead.phone}`} style={{ color: "#3B82F6", textDecoration: "none" }}>{lead.phone}</a>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#D1D5DB" }}>{lead.email}</td>
                        <td style={{ padding: "12px 14px", color: "#9CA3AF" }}>{lead.course || "—"}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            background: lead.source === "popup" ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)",
                            color: lead.source === "popup" ? "#3B82F6" : "#10B981",
                            padding: "3px 10px", borderRadius: "50px", fontSize: "11px", fontWeight: 600,
                          }}>{lead.source === "popup" ? "Popup" : "Contact Form"}</span>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#6B7280", whiteSpace: "nowrap" }}>
                          {new Date(lead.timestamp).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => {
                const csv = ["Name,Phone,Email,Course,Source,Timestamp",
                  ...leads.map(l => `${l.name},${l.phone},${l.email},${l.course || ""},${l.source},${l.timestamp}`)
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "edureach_leads.csv"; a.click();
              }} className="btn-gold" style={{ fontSize: "13px", padding: "10px 20px" }}>
                📥 Export CSV
              </button>
              <button onClick={() => {
                if (window.confirm("Delete all leads? This cannot be undone.")) {
                  setLeads([]); localStorage.removeItem("edureach_leads");
                }
              }} style={{
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                color: "#EF4444", padding: "10px 20px", borderRadius: "50px",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
              }}>
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: navScrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        boxShadow: navScrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <div style={{
              width: "40px", height: "40px", background: "linear-gradient(135deg, #1A56DB, #3B82F6)",
              borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
            }}>🎓</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 800, color: navScrolled ? "#0A1628" : "white", lineHeight: 1 }}>EduReach</div>
              <div style={{ fontSize: "10px", color: navScrolled ? "#1A56DB" : "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "1px" }}>ADMISSIONS</div>
            </div>
          </div>

          <div className="nav-links-desktop" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {[["home", "Home"], ["about", "About"], ["services", "Services"], ["colleges", "Colleges"], ["contact", "Contact"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: "6px 0",
                color: navScrolled ? "#1F2937" : "rgba(255,255,255,0.9)",
                fontSize: "14px", fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif",
                position: "relative", transition: "color 0.2s",
              }}
                className="nav-link"
                onMouseEnter={e => { e.target.style.color = navScrolled ? "#1A56DB" : "white"; }}
                onMouseLeave={e => { e.target.style.color = navScrolled ? "#1F2937" : "rgba(255,255,255,0.9)"; }}
              >{label}</button>
            ))}
            <button className="btn-primary" onClick={() => setPopupOpen(true)} style={{ padding: "10px 22px", fontSize: "13px" }}>
              Apply Now
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hide-mobile"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: navScrolled ? "#1F2937" : "white" }}>
            ☰
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "24px",
              color: navScrolled ? "#1F2937" : "white",
              "@media (maxWidth: 768px)": { display: "block" }
            }}>
          </button>
        </div>
        {mobileMenuOpen && (
          <div style={{
            background: "white", padding: "16px 24px", borderTop: "1px solid #E5E7EB",
            display: "flex", flexDirection: "column", gap: "4px",
          }}>
            {[["home", "Home"], ["about", "About"], ["services", "Services"], ["colleges", "Colleges"], ["contact", "Contact"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: "12px 0",
                color: "#1F2937", fontSize: "15px", fontWeight: 500,
                fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "left",
                borderBottom: "1px solid #F3F4F6",
              }}>{label}</button>
            ))}
            <button className="btn-primary" onClick={() => { setPopupOpen(true); setMobileMenuOpen(false); }}
              style={{ marginTop: "12px", width: "100%" }}>Apply Now</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0F2460 40%, #1A3A8A 70%, #1A56DB 100%)",
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "100px 5% 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.1) 0%, transparent 40%)",
        }} />
        <div style={{
          position: "absolute", top: "10%", right: "5%", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 6s ease-in-out infinite",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            <div style={{ animation: "fadeInUp 0.8s ease" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", padding: "8px 18px", borderRadius: "50px", marginBottom: "28px" }}>
                <span style={{ color: "#F59E0B", fontSize: "13px", fontWeight: 700, letterSpacing: "1px" }}>🏆 INDIA'S MOST TRUSTED ADMISSION CONSULTANCY</span>
              </div>

              <h1 className="hero-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "56px", fontWeight: 800,
                color: "white", lineHeight: 1.15, marginBottom: "24px",
              }}>
                Your Dream College.<br />
                <span style={{ color: "#F59E0B" }}>Our Expertise.</span><br />
                <span style={{ background: "linear-gradient(135deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Guaranteed Admission.
                </span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px", lineHeight: 1.75, marginBottom: "36px", maxWidth: "520px" }}>
                India's premier college admission consultants helping 10,000+ students secure direct admission to top colleges. Expert career counselling, zero-stress process, and confirmed seats — all under one roof.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
                <button className="btn-gold" onClick={() => setPopupOpen(true)} style={{ fontSize: "16px", padding: "16px 36px" }}>
                  🚀 Get Free Counselling
                </button>
                <button className="btn-secondary" onClick={() => scrollTo("colleges")}>
                  View Partner Colleges →
                </button>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }} className="hero-badges">
                {trustBadges.map(b => (
                  <div key={b.label} className="trust-badge">
                    <span>{b.icon}</span>
                    <span style={{ fontSize: "12px" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ animation: "fadeInUp 0.8s ease 0.3s both" }} className="hide-mobile">
              <div style={{
                background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "36px",
              }}>
                <h3 style={{ color: "white", fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "24px", textAlign: "center" }}>
                  Apply in 60 Seconds
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { ph: "Your Full Name", type: "text", key: "name" },
                    { ph: "Phone Number", type: "tel", key: "phone" },
                    { ph: "Email Address", type: "email", key: "email" },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{
                        width: "100%", padding: "13px 16px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "10px", background: "rgba(255,255,255,0.1)",
                        color: "white", fontSize: "14px", outline: "none",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    />
                  ))}
                  <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
                    style={{
                      width: "100%", padding: "13px 16px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px", background: "rgba(255,255,255,0.1)",
                      color: form.course ? "white" : "rgba(255,255,255,0.6)",
                      fontSize: "14px", outline: "none", cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                    <option value="" style={{ color: "#1F2937" }}>Select Course Interest</option>
                    <option style={{ color: "#1F2937" }}>Engineering / B.Tech</option>
                    <option style={{ color: "#1F2937" }}>MBA / Management</option>
                    <option style={{ color: "#1F2937" }}>Medical / MBBS</option>
                    <option style={{ color: "#1F2937" }}>Law / LLB</option>
                    <option style={{ color: "#1F2937" }}>Study Abroad</option>
                    <option style={{ color: "#1F2937" }}>Other</option>
                  </select>
                  <button className="btn-gold" onClick={handlePopupSubmit}
                    disabled={submitting || !form.name || !form.phone || !form.email}
                    style={{ width: "100%", padding: "15px", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {submitting ? <><Spinner />Submitting...</> : "Apply Now — It's Free! 🎓"}
                  </button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", textAlign: "center", marginTop: "12px" }}>
                  🔒 Secure & Confidential. No spam, ever.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "70px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              { num: "10,000+", label: "Students Placed", icon: "👨‍🎓" },
              { num: "50+", label: "Partner Colleges", icon: "🏫" },
              { num: "15+", label: "Years Experience", icon: "📅" },
              { num: "98%", label: "Success Rate", icon: "🎯" },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center", padding: "24px 16px",
                background: "rgba(255,255,255,0.06)", borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#F59E0B", fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 5%", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <div className="section-tag">🏆 About EduReach</div>
              <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: "24px" }}>
                15+ Years of Transforming <span className="gradient-text">Student Futures</span>
              </h2>
              <p style={{ color: "#6B7280", fontSize: "16px", lineHeight: 1.8, marginBottom: "20px" }}>
                EduReach is India's most trusted college admission consultancy firm, founded with a single mission: to make quality higher education accessible to every deserving student. With over 15 years of experience and 10,000+ successful admissions, we are the go-to destination for direct admission, career counselling, and college placement across India and abroad.
              </p>
              <p style={{ color: "#6B7280", fontSize: "16px", lineHeight: 1.8, marginBottom: "32px" }}>
                Our team of 50+ expert counsellors has deep relationships with leading universities and colleges, enabling us to offer confirmed seats through our exclusive college admission consultant network — something no other consultancy in India can match.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "36px" }}>
                {[
                  { icon: "✅", title: "Zero Hidden Fees", desc: "100% transparent pricing" },
                  { icon: "⚡", title: "Fast Processing", desc: "Admission in as few as 7 days" },
                  { icon: "🤝", title: "Dedicated Mentor", desc: "Personal counsellor assigned" },
                  { icon: "📱", title: "24/7 Support", desc: "Always available for queries" },
                ].map(item => (
                  <div key={item.title} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "22px", flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1F2937", fontSize: "14px" }}>{item.title}</div>
                      <div style={{ color: "#9CA3AF", fontSize: "13px" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={() => scrollTo("contact")}>
                Talk to a Counsellor →
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                background: "linear-gradient(135deg, #1A56DB, #0F2460)",
                borderRadius: "24px", padding: "48px 36px", color: "white", textAlign: "center",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎓</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "12px" }}>Our Core Promise</h3>
                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "32px" }}>
                  We don't just find you a college — we find you the <strong>right college</strong> that aligns with your career goals, budget, and aspirations.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { val: "50+", lbl: "Colleges" },
                    { val: "10K+", lbl: "Admissions" },
                    { val: "20+", lbl: "States" },
                    { val: "4.9★", lbl: "Rating" },
                  ].map(s => (
                    <div key={s.lbl} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px 12px" }}>
                      <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#F59E0B" }}>{s.val}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                position: "absolute", bottom: "-20px", left: "-20px",
                background: "white", borderRadius: "16px", padding: "20px 24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "14px",
              }}>
                <div style={{ fontSize: "32px" }}>⭐</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "20px", color: "#0A1628" }}>4.9 / 5.0</div>
                  <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Rated by 3,200+ students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 5%", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag">🛠️ Our Services</div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: "16px" }}>
              Everything You Need for <span className="gradient-text">Direct Admission</span>
            </h2>
            <p style={{ color: "#6B7280", fontSize: "17px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              From career counselling to confirmed admission — our end-to-end services are designed to make your college journey seamless, stress-free, and successful.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {services.map((s, i) => (
              <div key={s.title} className="card-hover" style={{
                background: "#fff", borderRadius: "20px", padding: "32px",
                border: "1.5px solid #E5E7EB", position: "relative", overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                  background: "linear-gradient(90deg, #1A56DB, #3B82F6)",
                }} />
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{s.icon}</div>
                <div style={{
                  display: "inline-block", background: "#EFF6FF", color: "#1A56DB",
                  padding: "4px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.5px", marginBottom: "12px",
                }}>{s.badge}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#0A1628", marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button className="btn-primary" onClick={() => setPopupOpen(true)} style={{ fontSize: "16px", padding: "16px 40px" }}>
              Get Free Counselling Session
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(135deg, #0A1628, #0F2460)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", padding: "6px 18px", borderRadius: "50px", marginBottom: "16px" }}>
              <span style={{ color: "#F59E0B", fontSize: "13px", fontWeight: 700 }}>⚡ HOW IT WORKS</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: "16px" }}>
              4 Simple Steps to Your <span style={{ color: "#F59E0B" }}>Dream College</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "17px", maxWidth: "550px", margin: "0 auto" }}>
              Our proven process has helped thousands of students secure admissions in top colleges across India.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", position: "relative" }}>
            <div style={{
              position: "absolute", top: "60px", left: "12.5%", right: "12.5%", height: "2px",
              background: "linear-gradient(90deg, #1A56DB, #F59E0B)",
              zIndex: 0,
            }} />
            {steps.map((s, i) => (
              <div key={s.num} className="step-card" style={{ zIndex: 1 }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: i === 3 ? "linear-gradient(135deg, #F59E0B, #FBBF24)" : "linear-gradient(135deg, #1A56DB, #3B82F6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", fontSize: "28px",
                  boxShadow: `0 8px 24px ${i === 3 ? "rgba(245,158,11,0.4)" : "rgba(26,86,219,0.4)"}`,
                  position: "relative", zIndex: 1,
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#F59E0B", letterSpacing: "2px", marginBottom: "8px" }}>{s.num}</div>
                <h3 style={{ color: "white", fontSize: "17px", fontWeight: 700, marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "56px" }}>
            <button className="btn-gold" onClick={() => setPopupOpen(true)} style={{ fontSize: "16px", padding: "16px 40px" }}>
              Start Your Journey Today 🚀
            </button>
          </div>
        </div>
      </section>

      {/* COLLEGES */}
      <section id="colleges" style={{ padding: "100px 5%", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag">🏫 Partner Colleges</div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: "16px" }}>
              50+ Top Colleges. <span className="gradient-text">Confirmed Seats.</span>
            </h2>
            <p style={{ color: "#6B7280", fontSize: "17px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              We have exclusive tie-ups with India's leading universities and colleges, ensuring you get a confirmed seat without the admission lottery stress.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "48px" }}>
            {colleges.map(c => (
              <div key={c.name} className="college-card">
                <div style={{
                  width: "54px", height: "54px", borderRadius: "12px",
                  background: `${c.color}15`, border: `2px solid ${c.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 800, color: c.color, flexShrink: 0,
                }}>{c.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#1F2937", fontSize: "15px" }}>{c.name}</div>
                  <div style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "2px" }}>📍 {c.location}</div>
                  <div style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>Programs: {c.programs}</div>
                </div>
                <div style={{
                  background: "#EFF6FF", color: "#1A56DB",
                  padding: "6px 14px", borderRadius: "50px",
                  fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
                }}>Tied Up ✓</div>
              </div>
            ))}
          </div>

          <div style={{
            background: "linear-gradient(135deg, #1A56DB, #0F2460)",
            borderRadius: "24px", padding: "48px", textAlign: "center", color: "white",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", marginBottom: "12px" }}>
              Don't See Your Dream College?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", marginBottom: "28px" }}>
              We work with 50+ colleges across India. Talk to our counsellors to check seat availability in your preferred institution.
            </p>
            <button className="btn-gold" onClick={() => setPopupOpen(true)} style={{ fontSize: "15px" }}>
              Check Availability Now
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag">💬 Student Testimonials</div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: "16px" }}>
              10,000+ Students <span className="gradient-text">Can't Be Wrong</span>
            </h2>
            <p style={{ color: "#6B7280", fontSize: "17px", maxWidth: "550px", margin: "0 auto" }}>
              Hear from the students whose lives we've transformed with the right guidance and the right college.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className="testimonial-card">
                <div style={{ marginBottom: "16px" }}>
                  <StarRating />
                </div>
                <p style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.8, marginBottom: "24px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "20px", borderTop: "1px solid #E5E7EB" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1A56DB, #3B82F6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "14px", flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1F2937", fontSize: "14px" }}>{t.name}</div>
                    <div style={{ color: "#9CA3AF", fontSize: "12px" }}>{t.program} · {t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "64px", flexWrap: "wrap" }}>
            {[
              { icon: "🏆", title: "Best Admission Consultancy Award", sub: "Education Excellence Awards 2023" },
              { icon: "⭐", title: "4.9 Star Rating", sub: "Google Reviews — 3,200+ Reviews" },
              { icon: "🎯", title: "ISO 9001:2015 Certified", sub: "Quality Management Certified" },
              { icon: "🔒", title: "Govt. Recognized", sub: "Registered Education Consultancy" },
            ].map(b => (
              <div key={b.title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{b.icon}</div>
                <div style={{ fontWeight: 700, color: "#1F2937", fontSize: "14px" }}>{b.title}</div>
                <div style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "2px" }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{
        background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)",
        padding: "64px 5%", textAlign: "center",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 800, color: "#0A1628", marginBottom: "16px" }}>
            Ready to Secure Your College Seat?
          </h2>
          <p style={{ color: "#374151", fontSize: "17px", marginBottom: "32px", lineHeight: 1.7 }}>
            Join 10,000+ students who trusted EduReach for their college admission. Free consultation. No commitment. Guaranteed results.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => setPopupOpen(true)} style={{ fontSize: "16px", padding: "16px 40px" }}>
              🎓 Apply Now — It's Free
            </button>
            <a href="tel:+918888888888" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,0,0,0.1)", color: "#0A1628", textDecoration: "none",
              padding: "16px 32px", borderRadius: "50px", fontWeight: 700, fontSize: "15px",
              border: "2px solid rgba(0,0,0,0.2)", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.1)"; }}
            >
              📞 Call Now: +91-88888 88888
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 5%", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "start" }}>
            <div>
              <div className="section-tag">📞 Get In Touch</div>
              <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: "20px" }}>
                Talk to an Expert <span className="gradient-text">Counsellor Today</span>
              </h2>
              <p style={{ color: "#6B7280", fontSize: "16px", lineHeight: 1.8, marginBottom: "36px" }}>
                Have questions about admissions, eligibility, fees, or college options? Our expert counsellors are available 6 days a week to give you personalised, unbiased guidance.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
                {[
                  { icon: "📞", label: "Call / WhatsApp", val: "+91-88888 88888", href: "tel:+918888888888" },
                  { icon: "📧", label: "Email Us", val: "info@edureach.in", href: "mailto:info@edureach.in" },
                  { icon: "📍", label: "Office Address", val: "123, Education Hub, Bandra West, Mumbai - 400050", href: null },
                  { icon: "⏰", label: "Office Hours", val: "Mon–Sat: 9:00 AM – 7:00 PM", href: null },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: "#EFF6FF", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "18px", flexShrink: 0,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#9CA3AF", fontSize: "12px", letterSpacing: "0.5px", marginBottom: "2px" }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ color: "#1A56DB", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}>{item.val}</a>
                      ) : (
                        <div style={{ color: "#1F2937", fontWeight: 600, fontSize: "14px" }}>{item.val}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "24px", padding: "40px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#0A1628", marginBottom: "8px" }}>
                Send Us a Message
              </h3>
              <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "28px" }}>We respond within 2 hours during business hours.</p>

              {!contactDone ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { ph: "Full Name *", key: "name", type: "text" },
                    { ph: "Phone Number *", key: "phone", type: "tel" },
                    { ph: "Email Address *", key: "email", type: "email" },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={contactForm[f.key]}
                      onChange={e => setContactForm({ ...contactForm, [f.key]: e.target.value })}
                      className="input-field" />
                  ))}
                  <select className="input-field" value={contactForm.course}
                    onChange={e => setContactForm({ ...contactForm, course: e.target.value })}
                    style={{ cursor: "pointer" }}>
                    <option value="">Course / Stream Interested In</option>
                    <option>Engineering / B.Tech</option>
                    <option>MBA / Management</option>
                    <option>Medical / MBBS / BDS</option>
                    <option>Law / LLB</option>
                    <option>Design / Architecture</option>
                    <option>Commerce / BBA / B.Com</option>
                    <option>Study Abroad</option>
                    <option>Other</option>
                  </select>
                  <textarea className="input-field" placeholder="Your message or specific query (optional)" value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={3} style={{ resize: "none" }} />
                  <button className="btn-primary" onClick={handleContactSubmit}
                    disabled={contactSubmitting || !contactForm.name || !contactForm.phone || !contactForm.email}
                    style={{ width: "100%", padding: "15px", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {contactSubmitting ? <><Spinner />Sending...</> : "Send Message 📩"}
                  </button>
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF" }}>🔒 Your data is 100% secure and private</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#0A1628", marginBottom: "10px" }}>Message Sent!</h4>
                  <p style={{ color: "#6B7280", lineHeight: 1.7, fontSize: "14px" }}>
                    Thank you! Our counsellor will reach out to you within <strong>2–4 hours</strong>. Keep your phone handy!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0A1628", color: "white", padding: "72px 5% 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #1A56DB, #3B82F6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎓</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 800 }}>EduReach</div>
                  <div style={{ fontSize: "10px", color: "#F59E0B", fontWeight: 600, letterSpacing: "1px" }}>ADMISSIONS</div>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.8, marginBottom: "24px" }}>
                India's most trusted college admission consultancy. Helping students achieve their academic dreams since 2009 with expert guidance, direct admissions, and career counselling.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {["📘", "📷", "🐦", "▶️"].map((icon, i) => (
                  <div key={i} style={{
                    width: "38px", height: "38px", background: "rgba(255,255,255,0.08)",
                    borderRadius: "10px", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "16px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1A56DB"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  >{icon}</div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Quick Links", links: ["Home", "About Us", "Services", "Partner Colleges", "Contact Us"],
              },
              {
                title: "Services", links: ["Career Counselling", "Direct Admission", "Scholarship Guidance", "Study Abroad", "Entrance Exam Prep"],
              },
              {
                title: "Contact", links: ["+91-88888 88888", "info@edureach.in", "Mumbai, Maharashtra", "Mon–Sat: 9AM–7PM"],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px", color: "white", letterSpacing: "0.5px" }}>{col.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map(link => (
                    <span key={link} style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={e => { e.target.style.color = "#F59E0B"; }}
                      onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.6)"; }}
                    >{link}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              © {new Date().getFullYear()} EduReach Admissions Pvt. Ltd. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer" }}>Privacy Policy</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer" }}>Terms of Service</span>
              <span onClick={() => {
                const key = prompt("Enter admin password:");
                if (key === ADMIN_PASSWORD) setShowAdminPanel(true);
                else if (key !== null) alert("Incorrect password");
              }} style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer" }}>Admin</span>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a href="https://wa.me/918888888888?text=Hello%20EduReach%2C%20I%20need%20admission%20guidance." target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}