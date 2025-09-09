import Link from "next/link";

export default function Header() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Cases", href: "/cases" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Prices", href: "/prices" },
    { name: "Reviews", href: "/reviews" },
    { name: "Team", href: "/team" },
  ];

  return (
    <header
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        marginBottom: "2rem",
      }}
    >
      <nav>
        {pages.map((page, index) => (
          <span key={page.href}>
            <Link
              href={page.href}
              style={{
                textDecoration: "none",
                color: "#0070f3",
                fontWeight: "500",
              }}
            >
              {page.name}
            </Link>
            {index < pages.length - 1 && (
              <span style={{ margin: "0 1rem", color: "#ccc" }}>|</span>
            )}
          </span>
        ))}
      </nav>
    </header>
  );
}
