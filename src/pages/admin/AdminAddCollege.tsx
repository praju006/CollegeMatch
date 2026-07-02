import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { AdminLayout } from "./AdminDashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INDIA_CITIES = [
  "Bangalore","Mumbai","Pune","New Delhi","Noida","Gurgaon","Chennai",
  "Hyderabad","Kochi","Kolkata","Ahmedabad","Jaipur","Bhopal","Indore",
  "Lucknow","Chandigarh","Mysore","Mangalore","Coimbatore","Visakhapatnam",
  "Bhubaneswar","Guwahati","Patna","Surat","Vadodara","Nagpur","Manipal",
  "Vellore","Pilani","Ranchi","Warangal","Vijayawada","Kota","Udaipur",
];

const FACILITIES_LIST = [
  "Library","Hostel","Cafeteria","Sports Complex","Gymnasium","Wi-Fi Campus",
  "Labs","Auditorium","Medical Center","Placement Cell","Research Center",
  "Swimming Pool","Tennis Court","Basketball Court","ATM","Transport",
];

const APPROVALS_LIST = [
  "NAAC A++","NAAC A+","NAAC A","UGC","AICTE","NBA","ABET","BCI",
  "MCI","PCI","NIRF Top 10","NIRF Top 50","ISO 9001",
];

interface Course {
  name: string; duration: string; fees: number;
  seats: number; cutoffMarks: number; specializations: string;
}

const emptyCourse = (): Course => ({
  name: "", duration: "4 years", fees: 0, seats: 60, cutoffMarks: 60, specializations: "",
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
        active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input hover:bg-muted",
      )}>
      {children}
    </button>
  );
}

const STEPS = ["Basic Info", "Courses", "Placement"];

export default function AdminAddCollege() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) { navigate("/admin"); return; }
    if (localStorage.getItem("adminRole") === "college") {
      navigate(`/admin/colleges/${localStorage.getItem("adminCollegeId")}/edit`);
    }
  }, []);

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep]       = useState(1);

  const [name, setName]           = useState("");
  const [shortName, setShortName] = useState("");
  const [city, setCity]           = useState("Bangalore");
  const [type, setType]           = useState<"Government"|"Private"|"Deemed">("Government");
  const [ranking, setRanking]     = useState(1);
  const [rating, setRating]       = useState(4.0);
  const [established, setEst]     = useState(2000);
  const [affiliation, setAff]     = useState("");
  const [description, setDesc]    = useState("");
  const [imageUrl, setImageUrl]   = useState("");
  const [website, setWebsite]     = useState("");
  const [appLink, setAppLink]     = useState("");
  const [selFacilities, setFac]   = useState<string[]>([]);
  const [selApprovals, setAppr]   = useState<string[]>([]);

  const [courses, setCourses] = useState<Course[]>([emptyCourse()]);

  const [avgPkg, setAvgPkg]     = useState(0);
  const [highPkg, setHighPkg]   = useState(0);
  const [placeRate, setPlRate]  = useState(0);
  const [recruiters, setRec]    = useState("");

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCourse    = () => setCourses(c => [...c, emptyCourse()]);
  const removeCourse = (i: number) => setCourses(c => c.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, field: keyof Course, val: any) =>
    setCourses(c => c.map((co, idx) => idx === i ? { ...co, [field]: val } : co));

  const handleSubmit = async () => {
    if (!name || !shortName || !affiliation || !description) {
      setError("Please fill all required fields in Step 1"); setStep(1); return;
    }
    if (courses.some(c => !c.name || c.fees <= 0)) {
      setError("Please fill all course details in Step 2"); setStep(2); return;
    }
    if (avgPkg <= 0 || highPkg <= 0 || placeRate <= 0) {
      setError("Please fill placement details in Step 3"); setStep(3); return;
    }

    setSaving(true); setError("");
    try {
      const body = {
        name, shortName, city, type, ranking, rating, established,
        affiliation, description, imageUrl, website, applicationLink: appLink,
        facilities: selFacilities, approvedBy: selApprovals,
        courses: courses.map(c => ({
          name: c.name, duration: c.duration, fees: Number(c.fees),
          seats: Number(c.seats), cutoffMarks: Number(c.cutoffMarks),
          specializations: c.specializations.split(",").map(s => s.trim()).filter(Boolean),
        })),
        placement: {
          averagePackage: Number(avgPkg), highestPackage: Number(highPkg),
          placementRate: Number(placeRate),
          topRecruiters: recruiters.split(",").map(r => r.trim()).filter(Boolean),
        },
      };

      const res  = await fetch(`${API}/api/admin/colleges`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("College added successfully!");
        setTimeout(() => navigate("/admin/colleges"), 1500);
      } else {
        setError(data.message || "Failed to add college");
      }
    } catch { setError("Network error. Try again."); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Add New College">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* step indicator */}
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => setStep(i+1)}
                className={cn(
                  "w-8 h-8 rounded-full text-xs font-semibold transition flex items-center justify-center border",
                  step===i+1 ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-input bg-background",
                )}>
                {i+1}
              </button>
              <span className={cn("text-sm font-medium", step===i+1 ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              {i < STEPS.length-1 && <span className="text-muted-foreground/40 mx-1">→</span>}
            </div>
          ))}
        </div>

        {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        {success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">{success}</div>}

        {/* ── STEP 1: Basic Info ── */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-foreground">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>College Name *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Indian Institute of Technology Bombay" />
                </div>
                <div className="space-y-1.5">
                  <Label>Short Name *</Label>
                  <Input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="e.g. IIT Bombay" />
                </div>
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INDIA_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={v => setType(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Deemed">Deemed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>NIRF Ranking *</Label>
                  <Input type="number" value={ranking} onChange={e => setRanking(+e.target.value)} min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating (0-5) *</Label>
                  <Input type="number" value={rating} onChange={e => setRating(+e.target.value)} min={0} max={5} step={0.1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Year Established *</Label>
                  <Input type="number" value={established} onChange={e => setEst(+e.target.value)} min={1800} max={2024} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Affiliation *</Label>
                  <Input value={affiliation} onChange={e => setAff(e.target.value)} placeholder="e.g. Autonomous / University of Mumbai" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Description *</Label>
                  <Textarea value={description} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Brief description of the college..." />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Website URL</Label>
                  <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://iitb.ac.in" />
                </div>
                <div className="space-y-1.5">
                  <Label>Application Link</Label>
                  <Input value={appLink} onChange={e => setAppLink(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES_LIST.map(f => (
                    <Chip key={f} active={selFacilities.includes(f)} onClick={() => toggleItem(selFacilities, setFac, f)}>{f}</Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accreditations &amp; Approvals</Label>
                <div className="flex flex-wrap gap-2">
                  {APPROVALS_LIST.map(a => (
                    <Chip key={a} active={selApprovals.includes(a)} onClick={() => toggleItem(selApprovals, setAppr, a)}>{a}</Chip>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep(2)}>Next: Courses →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 2: Courses ── */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Courses Offered</h3>
                <Button variant="outline" size="sm" onClick={addCourse}><Plus className="h-4 w-4" /> Add Course</Button>
              </div>

              <div className="space-y-4">
                {courses.map((course, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-muted/40 relative">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground">Course {i + 1}</p>
                      {courses.length > 1 && (
                        <button onClick={() => removeCourse(i)} className="text-destructive/70 hover:text-destructive transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1.5">
                        <Label>Course Name *</Label>
                        <Input value={course.name} onChange={e => updateCourse(i, "name", e.target.value)} placeholder="e.g. B.Tech Computer Science" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Duration *</Label>
                        <Select value={course.duration} onValueChange={v => updateCourse(i, "duration", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["1 year","2 years","3 years","4 years","5 years","6 years"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Annual Fees (₹) *</Label>
                        <Input type="number" value={course.fees} onChange={e => updateCourse(i, "fees", e.target.value)} placeholder="200000" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Total Seats *</Label>
                        <Input type="number" value={course.seats} onChange={e => updateCourse(i, "seats", e.target.value)} placeholder="60" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Cutoff Marks % *</Label>
                        <Input type="number" value={course.cutoffMarks} onChange={e => updateCourse(i, "cutoffMarks", e.target.value)} min={0} max={100} placeholder="75" />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <Label>Specializations (comma separated)</Label>
                        <Input value={course.specializations} onChange={e => updateCourse(i, "specializations", e.target.value)} placeholder="AI, Data Science, Cybersecurity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => setStep(3)}>Next: Placement →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: Placement ── */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-foreground">Placement Details</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Avg Package (LPA) *</Label>
                  <Input type="number" value={avgPkg} onChange={e => setAvgPkg(+e.target.value)} step={0.1} placeholder="12" />
                </div>
                <div className="space-y-1.5">
                  <Label>Highest Package (LPA) *</Label>
                  <Input type="number" value={highPkg} onChange={e => setHighPkg(+e.target.value)} step={0.1} placeholder="45" />
                </div>
                <div className="space-y-1.5">
                  <Label>Placement Rate % *</Label>
                  <Input type="number" value={placeRate} onChange={e => setPlRate(+e.target.value)} min={0} max={100} placeholder="92" />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label>Top Recruiters (comma separated)</Label>
                  <Input value={recruiters} onChange={e => setRec(e.target.value)} placeholder="Google, Microsoft, Amazon, Infosys, TCS" />
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">College:</span> <span className="font-medium text-foreground">{name || "—"}</span></div>
                  <div><span className="text-muted-foreground">City:</span> <span className="font-medium text-foreground">{city}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="font-medium text-foreground">{type}</span></div>
                  <div><span className="text-muted-foreground">Courses:</span> <span className="font-medium text-foreground">{courses.length}</span></div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="h-4 w-4" /> Add College</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
