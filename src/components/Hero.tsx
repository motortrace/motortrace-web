// src/components/Hero.tsx
import { Badge } from "./Badge";
import { Button } from "./Button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              🚀 Trusted by 500+ repair shops
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              All-in-One Repair Shop Management
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Streamline bookings, quotes, parts, and analytics in one platform. Increase efficiency, reduce paperwork, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Get a Free Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-500">
              {['Free 14-day trial', 'No setup fees', 'Cancel anytime'].map((text) => (
                <div key={text} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="ServicePro Dashboard Interface"
              width={700}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
