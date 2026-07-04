import React from 'react';
import { 
    ChevronRight, 
    Camera, 
    UserX, 
    Plus, 
    Building2, 
    Factory, 
    X, 
    Settings, 
    ShieldCheck, 
    CheckCircle, 
    Zap, 
    AlertTriangle, 
    History, 
    Printer 
} from 'lucide-react';

export default function WorkerProfile({ onBack }) {
    return (
        <section className="view active">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="text-primary hover:underline font-body-sm text-body-sm bg-transparent border-none cursor-pointer p-0">
                        Workforce
                    </button>
                    <ChevronRight className="text-outline" size={16} />
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Edit Worker Profile</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container transition-all font-semibold">
                        Discard Changes
                    </button>
                    <button className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm hover:shadow-lg transition-all font-semibold" style={{ color: 'white' }}>
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Edit Profile Grid */}
            <div className="grid grid-cols-12 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '24px' }}>
                
                {/* Left Column: Profile Card */}
                <div className="col-span-12 lg:col-span-4 space-y-6" style={{ gridColumn: 'span 12 / span 12', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                        <div className="h-24 bg-primary-container relative"></div>
                        <div className="px-6 pb-6 text-center -mt-12" style={{ padding: '0 24px 24px', textAlign: 'center', marginTop: '-48px' }}>
                            <div className="relative inline-block group">
                                <img 
                                    alt="James Peterson Profile" 
                                    className="w-32 h-32 rounded-full border-4 border-surface-container-lowest object-cover mx-auto" 
                                    style={{ width: '128px', height: '128px', borderRadius: '9999px', border: '4px solid var(--surface-container-lowest)', objectFit: 'cover' }}
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj-A6RA5IvC758cIMp4VEyRF9HG9Sqpq61B57fT586_2l902lKM2xeUon6wTy2de5cf9Z_nJRSXb20BcErSf45_mHq0nU0nqrZGFp-OpeacVogFHSCWaRydF7wjN824W46R_9k1z365ACuWGk3vKxG1MRJu37fJOHjS84fVeiaFHUfKAkte4x3ttxcUgixcZPx189QRGuXzSS9plS1ER2GIjpHbhBavKFEeJToNZGyi5k6bhUR15MFBHuwBtoFxzEzip_sxCkcvt4" 
                                />
                                <button className="absolute bottom-1 right-1 bg-surface rounded-full p-2 border border-outline-variant hover:bg-surface-container transition-all" style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: 'var(--surface)', borderRadius: '9999px', padding: '8px', border: '1px solid var(--outline-variant)', cursor: 'pointer' }}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="font-headline-md text-headline-md mt-4 text-[24px] font-bold" style={{ margin: '16px 0 0 0' }}>James Peterson</h2>
                            <p className="text-on-surface-variant font-body-base" style={{ margin: '4px 0 0 0' }}>Lead Electrical Technician</p>
                            
                            <div className="flex justify-center mt-4" style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                <span className="px-3 py-1 bg-status-on-track-bg text-status-on-track-text rounded-full font-label-caps text-label-caps flex items-center gap-1 uppercase" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></span>
                                    Active
                                </span>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-outline-variant grid grid-cols-2 gap-4" style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                                <div className="text-left" style={{ textAlign: 'left' }}>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" style={{ fontSize: '11px', margin: '0 0 4px 0' }}>COMPLETED TASKS</p>
                                    <p className="font-display-lg text-display-lg font-bold text-primary" style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: 'var(--accent-blue)' }}>142</p>
                                </div>
                                <div className="text-left border-l border-outline-variant pl-4" style={{ textAlign: 'left', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" style={{ fontSize: '11px', margin: '0 0 4px 0' }}>ATTENDANCE</p>
                                    <p className="font-display-lg text-display-lg font-bold text-primary" style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: 'var(--accent-blue)' }}>98%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                        <h3 className="font-body-base text-body-base font-bold text-danger mb-2" style={{ color: 'var(--accent-red)', margin: '0 0 8px 0', fontWeight: 'bold' }}>Access Control</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6" style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Deactivating this worker will revoke their access to the MEPac mobile suite and archive their historical data for auditing.
                        </p>
                        <button className="w-full px-6 py-3 border border-danger text-danger rounded-lg font-body-base font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2" style={{ width: '100%', padding: '12px 24px', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: 'var(--radius-md)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => confirm('Are you sure you want to deactivate this worker? All mobile access will be revoked immediately.') && alert('Worker status updated to: Inactive')}>
                            <UserX size={18} />
                            Deactivate James Peterson
                        </button>
                    </div>
                </div>

                {/* Right Column: Form Sections */}
                <div className="col-span-12 lg:col-span-8 space-y-6 lg:pl-4" style={{ gridColumn: 'span 12 / span 12', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Section: Personal Details */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="px-6 py-4 border-b border-outline-variant" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-body-base text-body-base font-bold text-[16px]" style={{ margin: 0 }}>Personal Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>FULL NAME</label>
                                <input className="w-full border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} type="text" defaultValue="James Peterson" />
                            </div>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>DATE OF BIRTH</label>
                                <input className="w-full border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} type="date" defaultValue="1985-05-14" />
                            </div>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MOBILE NUMBER</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>+1</span>
                                    <input className="w-full border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px 10px 40px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} type="tel" defaultValue="(555) 123-4567" />
                                </div>
                            </div>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>EMERGENCY CONTACT</label>
                                <input className="w-full border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} type="text" defaultValue="Sarah Peterson (Wife) - (555) 987-6543" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Professional Info */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="px-6 py-4 border-b border-outline-variant" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-body-base text-body-base font-bold text-[16px]" style={{ margin: 0 }}>Professional Information</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CURRENT ROLE</label>
                                <select className="w-full border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} defaultValue="Lead Electrical Technician">
                                    <option>Electrical Technician</option>
                                    <option value="Lead Electrical Technician">Lead Electrical Technician</option>
                                    <option>Mechanical Supervisor</option>
                                    <option>Plumbing Specialist</option>
                                </select>
                            </div>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>WORKER ID</label>
                                <input className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-on-surface-variant cursor-not-allowed" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }} readOnly type="text" value="MEP-EL-2024-089" />
                            </div>
                            <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>DATE OF JOINING</label>
                                <input className="w-full border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm" style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: 'var(--bg-base)', color: 'var(--text-primary)' }} type="date" defaultValue="2021-03-12" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Project Assignments */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="font-body-base text-body-base font-bold text-[16px]" style={{ margin: 0 }}>Project Assignments</h3>
                            <button className="text-primary font-body-sm font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Plus size={16} /> Assign to New Project
                            </button>
                        </div>
                        <div className="p-6" style={{ padding: '24px' }}>
                            <div className="flex flex-wrap gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {/* Tag 1 */}
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-full font-body-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: '1px', color: '#1e40af' }}>
                                    <Building2 size={16} />
                                    Skylight Plaza Towers
                                    <button className="hover:text-error transition-colors bg-transparent border-none cursor-pointer p-0 ml-1"><X size={14} /></button>
                                </div>
                                {/* Tag 2 */}
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-full font-body-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: '1px', color: '#1e40af' }}>
                                    <Factory size={16} />
                                    North Industrial Park Phase II
                                    <button className="hover:text-error transition-colors bg-transparent border-none cursor-pointer p-0 ml-1"><X size={14} /></button>
                                </div>
                                {/* Tag 3 */}
                                <div className="flex items-center gap-2 bg-surface-container border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-full font-body-sm italic" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)', borderWidth: '1px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    <span>No active secondary project</span>
                                </div>
                            </div>
                            
                            {/* Mini Table for Hours Allocation */}
                            <div className="mt-8" style={{ marginTop: '32px' }}>
                                <table className="w-full border-collapse" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr className="border-b border-outline-variant" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <th className="py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-[12px]" style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>PROJECT NAME</th>
                                            <th className="py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-[12px]" style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>ALLOCATION %</th>
                                            <th className="py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-[12px] text-right" style={{ padding: '12px 0', color: 'var(--text-secondary)', textAlign: 'right' }}>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td className="py-4 font-body-sm font-medium" style={{ padding: '16px 0' }}>Skylight Plaza Towers</td>
                                            <td className="py-4" style={{ padding: '16px 0' }}>
                                                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <input className="w-32 accent-primary" type="range" defaultValue="60" style={{ width: '128px', accentColor: 'var(--accent-blue)' }} />
                                                    <span className="font-body-sm font-bold">60%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right" style={{ padding: '16px 0', textAlign: 'right' }}>
                                                <button className="text-outline hover:text-primary bg-transparent border-none cursor-pointer" style={{ color: 'var(--text-muted)' }}><Settings size={18} /></button>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td className="py-4 font-body-sm font-medium" style={{ padding: '16px 0' }}>North Industrial Park Phase II</td>
                                            <td className="py-4" style={{ padding: '16px 0' }}>
                                                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <input className="w-32 accent-primary" type="range" defaultValue="40" style={{ width: '128px', accentColor: 'var(--accent-blue)' }} />
                                                    <span className="font-body-sm font-bold">40%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right" style={{ padding: '16px 0', textAlign: 'right' }}>
                                                <button className="text-outline hover:text-primary bg-transparent border-none cursor-pointer" style={{ color: 'var(--text-muted)' }}><Settings size={18} /></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Section: Professional Certifications */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-6" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                        <h3 className="font-body-base text-body-base font-bold mb-4 text-[16px]" style={{ margin: '0 0 16px 0' }}>Certifications & Compliance</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                            <div className="flex items-center p-4 border border-outline-variant rounded-lg gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                <ShieldCheck className="text-primary" size={24} style={{ color: 'var(--accent-blue)' }} />
                                <div className="flex-1" style={{ flex: 1 }}>
                                    <p className="font-body-sm font-bold" style={{ margin: 0 }}>OSHA 30 Safety Training</p>
                                    <p className="text-[11px] text-on-surface-variant" style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)' }}>Expires: Dec 2025</p>
                                </div>
                                <CheckCircle className="text-status-on-track-text" size={20} style={{ color: 'var(--accent-green)' }} />
                            </div>
                            <div className="flex items-center p-4 border border-outline-variant rounded-lg gap-3 bg-amber-50" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb' }}>
                                <Zap className="text-amber-600" size={24} style={{ color: '#d97706' }} />
                                <div className="flex-1" style={{ flex: 1 }}>
                                    <p className="font-body-sm font-bold" style={{ margin: 0 }}>Journeyman Electrician License</p>
                                    <p className="text-[11px] text-amber-800" style={{ margin: '2px 0 0 0', color: '#92400e' }}>Renewal required in 14 days</p>
                                </div>
                                <AlertTriangle className="text-amber-600" size={20} style={{ color: '#d97706' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Audit Info */}
            <footer className="mt-12 py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant font-body-sm" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <p style={{ margin: 0 }}>Last edited by: <span className="font-bold">Marcus Chen</span> (2 hours ago)</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--border-subtle)' }}></div>
                    <p style={{ margin: 0 }}>Created: <span className="font-bold">March 12, 2021</span></p>
                </div>
                <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <a className="hover:text-primary transition-colors flex items-center gap-1 text-inherit no-underline" href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <History size={14} />
                        View Audit Log
                    </a>
                    <a className="hover:text-primary transition-colors flex items-center gap-1 text-inherit no-underline" href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Printer size={14} />
                        Export PDF Profile
                    </a>
                </div>
            </footer>
        </section>
    );
}
