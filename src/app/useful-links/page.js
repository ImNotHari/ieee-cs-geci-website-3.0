import Link from "next/link";
import Header from "@/components/Header";
import "./useful-links.css";

export const metadata = {
  title: "Useful Links – IEEE CS SBC GECI",
  description: "Important resources, guidelines, and portals for IEEE CS members.",
};

const linkCategories = [
  {
    category: "Official Portals",
    links: [
      { name: "IEEE.org Global", desc: "Main portal for IEEE members", url: "#" },
      { name: "IEEE Computer Society", desc: "Computer Society home page", url: "#" },
      { name: "IEEE Xplore Digital Library", desc: "Research papers and journals", url: "#" },
      { name: "IEEE vTools", desc: "Event reporting and management", url: "#" },
    ],
  },
  {
    category: "Student Branch Resources",
    links: [
      { name: "Membership Benefits", desc: "Discover what IEEE offers students", url: "#" },
      { name: "SBC GECI Constitution", desc: "Bylaws and branch regulations", url: "#" },
      { name: "Reimbursement Form", desc: "For official event expenditures", url: "#" },
      { name: "Brand Guidelines", desc: "Logos, colors, and typography", url: "#" },
    ],
  },
  {
    category: "Learning & Development",
    links: [
      { name: "CS Digital Library", desc: "Access to CS magazines and books", url: "#" },
      { name: "IEEE Learning Network", desc: "Certifications and courses", url: "#" },
      { name: "Code of Ethics", desc: "Professional guidelines for engineers", url: "#" },
      { name: "Resume Templates", desc: "Standard formats for CS students", url: "#" },
    ],
  },
];

export default function UsefulLinksPage() {
  return (
    <div className="links-page">
      <Header />

      <section className="links-hero">
        <div className="links-hero-content">
          <div className="links-breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span>Useful Links</span>
          </div>
          <h1 className="links-page-title">
            USEFUL <span>LINKS.</span>
          </h1>
          <p className="links-page-subtitle">
            A curated collection of resources, portals, and documents for IEEE CS members.
          </p>
        </div>
      </section>

      <div className="links-container">
        {linkCategories.map((group, idx) => (
          <div key={idx} className="links-group">
            <h2 className="links-group-title">{group.category}</h2>
            <div className="links-grid">
              {group.links.map((link, i) => (
                <a key={i} href={link.url} className="link-card">
                  <div className="link-card-content">
                    <h3 className="link-card-title">{link.name}</h3>
                    <p className="link-card-desc">{link.desc}</p>
                  </div>
                  <div className="link-card-arrow">↗</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
