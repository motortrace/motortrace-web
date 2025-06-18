// src/components/Features.tsx
import React from "react";
import { Calendar, FileText, Package, Search, BarChart3, Users } from "lucide-react";
import { ArrowRight } from "lucide-react";

const featureList = [
  { title: "Booking & Scheduling", icon: <Calendar />, color: "blue", desc: "Online booking with automated reminders" },
  { title: "Quotation Management", icon: <FileText />, color: "green", desc: "Instant quotes with pricing and signatures" },
  { title: "Parts Ordering", icon: <Package />, color: "purple", desc: "Catalog with supplier integrations" },
  { title: "Digital Vehicle Inspections", icon: <Search />, color: "orange", desc: "Photo/video reports in-app" },
  { title: "Real-Time Analytics", icon: <BarChart3 />, color: "red", desc: "Track performance & revenue" },
  { title: "Customer Management", icon: <Users />, color: "teal", desc: "Profiles with service history" },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything You Need to Run Your Shop</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for automotive repair shops
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map(({ title, icon, color, desc }) => (
            <div key={title} className={`group relative bg-${color}-50 to-${color}-100/50 rounded-2xl p-8 border border-${color}-100 hover:shadow-xl transition hover:-translate-y-1`}>              
              <div className={`absolute top-6 right-6 w-12 h-12 bg-${color}-500 rounded-xl flex items-center justify-center group-hover:scale-110`}>                
                {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{desc}</p>
              <div className={`text-${color}-600 font-medium text-sm flex items-center group-hover:text-${color}-700`}>
                Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
