import Link from "next/link";

const navItems = [
  { number: "01", label: "Events", href: "/events" },
  { number: "02", label: "Achievements", href: "/achievements" },
  { number: "03", label: "Execom", href: "/execom" },
  { number: "04", label: "Explore", href: "/explore" },
  { number: "05", label: "Useful Links", href: "/useful-links" },
  { number: "06", label: "Blog", href: "/blog" },
];

export default function NavBar() {
  return (
    <nav className="nav-bar" id="nav-bar" aria-label="Section navigation">
      {navItems.map((item) => (
        <Link
          key={item.number}
          href={item.href}
          className="nav-item"
          id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <span className="nav-item-number">{item.number}</span>
          <span className="nav-item-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
