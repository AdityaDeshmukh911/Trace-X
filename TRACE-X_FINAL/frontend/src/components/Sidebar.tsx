import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Shield, Network, BellRing, UploadCloud, Snowflake, 
  Layers, FolderOpen, ShieldCheck, LogOut, FileText, Settings 
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { fetchAlerts } from "../api/client";
import logoImg from "../assets/logo.png";

interface NavGroup {
  group: string;
  items: {
    icon: any;
    label: string;
    path: string;
    badgeKey?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "OPERATIONS",
    items: [
      { icon: Network,     label: "Investigate",       path: "/" },
      { icon: BellRing,    label: "Threat Alerts",     path: "/alerts", badgeKey: "alerts" },
      { icon: FolderOpen,  label: "Case Files",        path: "/cases" },
    ]
  },
  {
    group: "FORENSICS & ACTION",
    items: [
      { icon: Layers,      label: "Cluster Explorer",  path: "/clusters" },
      { icon: UploadCloud, label: "Bulk Ingestion",    path: "/ingest" },
      { icon: Snowflake,   label: "Freeze & VASP Desk",path: "/freeze" },
    ]
  },
  {
    group: "LEGAL & COMPLIANCE",
    items: [
      { icon: FileText,    label: "Reports & Dossiers",path: "/reports" },
      { icon: ShieldCheck, label: "Evidence Verifier", path: "/evidence" },
      { icon: Settings,    label: "System Settings",   path: "/settings" },
    ]
  }
];

export default function Sidebar() {
  const loc = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [unreadAlerts, setUnreadAlerts] = useState<number>(0);

  useEffect(() => {
    fetchAlerts(50)
      .then((res) => setUnreadAlerts(res.unread_count))
      .catch(() => {});
  }, [loc.pathname]);

  return (
    <aside className="w-16 lg:w-64 h-screen bg-[#0A0D15] border-r border-white/[0.07] flex flex-col shrink-0 font-sans select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.07] bg-[#0C101A]/60">
        <div className="w-9 h-9 rounded-xl bg-[#111726] border border-emerald-500/30 p-1.5 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] shrink-0 flex items-center justify-center">
          <img src={logoImg} alt="TRACE-X" className="w-full h-full object-contain" />
        </div>
        <div className="hidden lg:block min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-extrabold text-sm tracking-wide">TRACE-X</p>
            <span className="text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded-full">
              LEA 2.1
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-slate-400 text-[10px] font-medium tracking-tight truncate">Sovereign Forensics Node</p>
          </div>
        </div>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 p-2.5 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <div className="hidden lg:block text-[9px] font-mono font-bold tracking-widest text-slate-500 px-3 pt-1">
              {grp.group}
            </div>
            {grp.items.map(({ icon: Icon, label, path, badgeKey }) => {
              const active = loc.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    active
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] font-semibold"
                      : "text-slate-400 hover:bg-[#121724] hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={16} 
                      className={`shrink-0 transition-transform group-hover:scale-105 ${
                        active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                      }`} 
                    />
                    <span className="hidden lg:block tracking-tight">{label}</span>
                  </div>

                  {badgeKey === "alerts" && unreadAlerts > 0 && (
                    <span className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">
                      {unreadAlerts}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-white/[0.07] bg-[#07090E]/80">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#101522]/80 border border-white/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center shrink-0 border border-emerald-400/30 text-white font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-tight">{user?.name || "Insp. Aditya Prashant Deshmukh"}</p>
            <p className="text-emerald-400/80 text-[10px] font-mono truncate">{user?.badge || "CY-MH-4019"}</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="mt-2 flex items-center justify-center lg:justify-start gap-2 w-full px-3 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors text-xs font-medium"
        >
          <LogOut size={13} />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
