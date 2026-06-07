import "@/styles/member.css";
import Sidebar from "@/components/member/Sidebar";

export const metadata = {
  title: "Member Dashboard – IEEE CS SBC GECI",
  description: "Personal dashboard for IEEE CS GECI chapter members.",
};

export default function MemberLayout({ children }) {
  return (
    <div className="member-body">
      <Sidebar />
      {children}
    </div>
  );
}
