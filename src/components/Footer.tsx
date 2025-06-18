// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 lg:px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">ServicePro</span>
          </div>
          <p className="text-gray-400">
            The complete repair shop management solution trusted by professionals worldwide.
          </p>
          <div className="flex space-x-4">
            {/* Replace with real social icons */}
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {[
          { title: "Product", links: ["Features", "Pricing", "Integrations", "API"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Status"] },
        ].map((col) => (
          <div key={col.title} className="space-y-4">
            <h3 className="text-lg font-semibold">{col.title}</h3>
            <ul className="space-y-2 text-gray-400">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2 lg:col-span-1 space-y-4">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} ServicePro. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-gray-400">
                <span>1-800-SERVICE</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>hello@servicepro.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
