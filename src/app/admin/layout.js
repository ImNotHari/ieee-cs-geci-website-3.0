import "./admin.css";

export const metadata = {
  title: "Admin Dashboard – IEEE CS SBC GECI",
  description: "Admin panel for managing IEEE CS GECI members.",
};

export default function AdminLayout({ children }) {
  return <div className="admin-body">{children}</div>;
}
