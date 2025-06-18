
import { Link } from "react-router-dom"; // ✅ Correct import for React + Vite
import { Button } from "./Button";
import { Wrench } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-blue-600" />
          <Link to="/" className="text-xl font-bold text-gray-900">
            ServicePro
          </Link>
        </div>

        {/* Navigation (desktop) */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Demo</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
}
