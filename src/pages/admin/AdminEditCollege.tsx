import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminLayout } from "./AdminDashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function AdminEditCollege() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token    = localStorage.getItem("adminToken");

  const [college, setCollege]       = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState("");
  const [activeTab, setActiveTab]   = useState("basic");
  const [newCourse, setNewCourse]   = useState({ name:"", duration:"4 years", fees:0, seats:60, cutoffMarks:60, specializations:"" });
  const [addingCourse, setAddingCourse] = useState(false);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string|null>(null);
  const [courseEdit, setCourseEdit] = useState<any>({});

  useEffect(() => {
    if (!token) { navigate("/admin"); return; }
    fetch(`${API}/api/admin/colleges/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401 || r.status === 403) { navigate("/admin"); return null; } return r.json(); })
      .then(data => { if (data) setCollege(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleItem = (field: string, item: string) => {
    const current = college[field] || [];
    setCollege((c: any) => ({
      ...c,
      [field]: current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item],
    }));
  };

  const saveBasic = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/admin/colleges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(college),
      });
      const data = await res.json();
      if (res.ok) { setCollege(data.college); showToast("Saved successfully ✓"); }
      else showToast(data.message || "Save failed");
    } catch { showToast("Network error"); }
    finally { setSaving(false); }
  };

  const addCourse = async () => {
    if (!newCourse.name || newCourse.fees <= 0) { showToast("Fill course name and fees"); return; }
    setAddingCourse(true);
    try {
      const body = {
        ...newCourse,
        fees: Number(newCourse.fees), seats: Number(newCourse.seats),
        cutoffMarks: Number(newCourse.cutoffMarks),
        specializations: newCourse.specializations.split(",").map(s => s.trim()).filter(Boolean),
      };
      const res  = await fetch(`${API}/api/admin/colleges/${id}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setCollege(data.college);
        setNewCourse({ name:"", duration:"4 years", fees:0, seats:60, cutoffMarks:60, specializations:"" });
        setShowNewCourse(false);
        showToast("Course added ✓");
      } else showToast(data.message || "Failed to add course");
    } catch { showToast("Network error"); }
    finally { setAddingCourse(false); }
  };

  const saveCourse = async (courseId: string) => {
    try {
      const body = {
        ...courseEdit,
        fees: Number(courseEdit.fees), seats: Number(courseEdit.seats),
        cutoffMarks: Number(courseEdit.cutoffMarks),
        specializations: typeof courseEdit.specializations === "string"
          ? courseEdit.specializations.split(",").map((s:string) => s.trim()).filter(Boolean)
          : courseEdit.specializations,
      };
      const res  = await fetch(`${API}/api/admin/colleges/${id}/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) { setCollege(data.college); setEditingCourse(null); showToast("Course updated ✓"); }
      else showToast(data.message || "Failed to update course");
    } catch { showToast("Network error"); }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const res  = await fetch(`${API}/api/admin/colleges/${id}/courses/${courseId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) { setCollege(data.college); showToast("Course deleted"); }
    } catch { showToast("Network error"); }
  };

  if (loading) return (
    <AdminLayout title="Edit College">
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </AdminLayout>
  );

  if (!college) return (
    <AdminLayout title="Edit College">
      <p className="text-muted-foreground text-center py-20">College not found.</p>
    </AdminLayout>
  );

  return (
    <AdminLayout title={`Edit: ${college.name}`}>
      <div className="max-w-3xl mx-auto space-y-5">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ── BASIC TAB ── */}
        {activeTab === "basic" && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>College Name</Label>
                  <Input value={college.name} onChange={e => setCollege((c:any) => ({...c, name:e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Short Name</Label>
                  <Input value={college.shortName} onChange={e => setCollege((c:any) => ({...c, shortName:e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Select value={college.city} onValueChange={v => setCollege((c:any) => ({...c, city:v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INDIA_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={college.type} onValueChange={v => setCollege((c:any) => ({...c, type:v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Deemed">Deemed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>NIRF Ranking</Label>
                  <Input type="number" value={college.ranking} onChange={e => setCollege((c:any) => ({...c, ranking:+e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating (0–5)</Label>
                  <Input type="number" value={college.rating} onChange={e => setCollege((c:any) => ({...c, rating:+e.target.value}))} min={0} max={5} step={0.1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Year Established</Label>
                  <Input type="number" value={college.established} onChange={e => setCollege((c:any) => ({...c, established:+e.target.value}))} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Affiliation</Label>
                  <Input value={college.affiliation} onChange={e => setCollege((c:any) => ({...c, affiliation:e.target.value}))} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={college.description} onChange={e => setCollege((c:any) => ({...c, description:e.target.value}))} rows={3} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={college.imageUrl} onChange={e => setCollege((c:any) => ({...c, imageUrl:e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input value={college.website} onChange={e => setCollege((c:any) => ({...c, website:e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Application Link</Label>
                  <Input value={college.applicationLink} onChange={e => setCollege((c:any) => ({...c, applicationLink:e.target.value}))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES_LIST.map(f => (
                    <Chip key={f} active={(college.facilities||[]).includes(f)} onClick={() => toggleItem("facilities", f)}>{f}</Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accreditations</Label>
                <div className="flex flex-wrap gap-2">
                  {APPROVALS_LIST.map(a => (
                    <Chip key={a} active={(college.approvedBy||[]).includes(a)} onClick={() => toggleItem("approvedBy", a)}>{a}</Chip>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={saveBasic} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── COURSES TAB ── */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            {college.courses?.map((course: any) => (
              <Card key={course._id}>
                <CardContent className="p-5">
                  {editingCourse === course._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                          <Label>Course Name</Label>
                          <Input value={courseEdit.name} onChange={e => setCourseEdit((c:any)=>({...c,name:e.target.value}))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Duration</Label>
                          <Select value={courseEdit.duration} onValueChange={v => setCourseEdit((c:any)=>({...c,duration:v}))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["1 year","2 years","3 years","4 years","5 years"].map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Fees (₹/yr)</Label>
                          <Input type="number" value={courseEdit.fees} onChange={e => setCourseEdit((c:any)=>({...c,fees:e.target.value}))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Seats</Label>
                          <Input type="number" value={courseEdit.seats} onChange={e => setCourseEdit((c:any)=>({...c,seats:e.target.value}))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Cutoff %</Label>
                          <Input type="number" value={courseEdit.cutoffMarks} onChange={e => setCourseEdit((c:any)=>({...c,cutoffMarks:e.target.value}))} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <Label>Specializations (comma separated)</Label>
                          <Input value={Array.isArray(courseEdit.specializations)?courseEdit.specializations.join(", "):courseEdit.specializations}
                            onChange={e => setCourseEdit((c:any)=>({...c,specializations:e.target.value}))} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveCourse(course._id)}>Save Course</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCourse(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground mb-1">{course.name}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>⏱ {course.duration}</span>
                          <span>💰 ₹{(course.fees/100000).toFixed(1)}L/yr</span>
                          <span>👥 {course.seats} seats</span>
                          <span>📊 Cutoff: {course.cutoffMarks}%</span>
                        </div>
                        {course.specializations?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {course.specializations.map((s:string) => (
                              <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => { setEditingCourse(course._id); setCourseEdit(course); }}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteCourse(course._id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {!showNewCourse ? (
              <button onClick={() => setShowNewCourse(true)}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add New Course
              </button>
            ) : (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold text-foreground text-sm">New Course</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label>Course Name *</Label>
                      <Input value={newCourse.name} onChange={e => setNewCourse(c=>({...c,name:e.target.value}))} placeholder="e.g. B.Tech Computer Science" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Duration</Label>
                      <Select value={newCourse.duration} onValueChange={v => setNewCourse(c=>({...c,duration:v}))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["1 year","2 years","3 years","4 years","5 years"].map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Fees (₹/yr) *</Label>
                      <Input type="number" value={newCourse.fees} onChange={e => setNewCourse(c=>({...c,fees:+e.target.value}))} placeholder="200000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Seats</Label>
                      <Input type="number" value={newCourse.seats} onChange={e => setNewCourse(c=>({...c,seats:+e.target.value}))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cutoff %</Label>
                      <Input type="number" value={newCourse.cutoffMarks} onChange={e => setNewCourse(c=>({...c,cutoffMarks:+e.target.value}))} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label>Specializations</Label>
                      <Input value={newCourse.specializations} onChange={e => setNewCourse(c=>({...c,specializations:e.target.value}))} placeholder="AI, Data Science" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCourse} disabled={addingCourse}>{addingCourse?"Adding…":"Add Course"}</Button>
                    <Button variant="outline" onClick={() => setShowNewCourse(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── PLACEMENT TAB ── */}
        {activeTab === "placement" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground mb-2">Placement Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Avg Package (LPA)</Label>
                  <Input type="number" value={college.placement?.averagePackage}
                    onChange={e => setCollege((c:any)=>({...c,placement:{...c.placement,averagePackage:+e.target.value}}))} step={0.1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Highest Package (LPA)</Label>
                  <Input type="number" value={college.placement?.highestPackage}
                    onChange={e => setCollege((c:any)=>({...c,placement:{...c.placement,highestPackage:+e.target.value}}))} step={0.1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Placement Rate %</Label>
                  <Input type="number" value={college.placement?.placementRate}
                    onChange={e => setCollege((c:any)=>({...c,placement:{...c.placement,placementRate:+e.target.value}}))} min={0} max={100} />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label>Top Recruiters (comma separated)</Label>
                  <Input value={college.placement?.topRecruiters?.join(", ")}
                    onChange={e => setCollege((c:any)=>({...c,placement:{...c.placement,topRecruiters:e.target.value.split(",").map((r:string)=>r.trim()).filter(Boolean)}}))} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={saveBasic} disabled={saving}>{saving?"Saving…":"Save Placement Data"}</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-5 py-3 rounded-md text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
