import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

export default function AdminLayout() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className={`flex-1 ${expanded ? "ml-64" : "ml-20"}`}>
        <Outlet />
      </div>
    </div>
  );
}
