// src/components/OurProjects.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function OurProjects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Weddings", "Corporate", "Birthday", "Product Launch"];
  const projects = [
    {
      id: 1,
      title: "Luxury Wedding",
      category: "Weddings",
      image: "/images/projects/wedding1.jpg",
      description: "Elegant wedding with 500+ guests and stunning decor",
    },
    {
      id: 2,
      title: "Corporate Gala",
      category: "Corporate",
      image: "/images/projects/corporate1.jpg",
      description: "Exclusive gala dinner for top executives",
    },
    {
      id: 3,
      title: "Birthday Bash",
      category: "Birthday",
      image: "/images/projects/birthday1.jpg",
      description: "Fun and colorful themed birthday celebration",
    },
    {
      id: 4,
      title: "Product Launch",
      category: "Product Launch",
      image: "/images/projects/product1.jpg",
      description: "Innovative product reveal with VIP guests",
    },
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-5xl font-bold">Our Projects</h1>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-xl">
          From intimate gatherings to grand events, we do it all.
        </p>
      </section>

      {/* Categories */}
      <section className="py-10 px-6 flex justify-center gap-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border transition ${
              activeCategory === cat ? "bg-blue-500 text-white" : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Projects Grid */}
      <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
          >
            <img
              src={proj.image}
              alt={proj.title}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-center p-4 transition">
              <h2 className="text-white text-xl font-semibold">{proj.title}</h2>
              <p className="text-white mt-2 text-sm">{proj.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Projects Carousel */}
      <section className="py-10 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Projects</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {projects.map((proj) => (
            <SwiperSlide key={proj.id}>
              <div className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                <img src={proj.image} alt={proj.title} className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                  <h3 className="text-white font-semibold">{proj.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center bg-blue-50">
        <h2 className="text-4xl font-bold mb-4">Let’s Make Your Next Event Unforgettable</h2>
        <p className="text-gray-700 mb-8">
          Get in touch with our team to start planning your dream event today.
        </p>
        <button className="px-8 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition">
          Book a Consultation
        </button>
      </section>
    </div>
  );
}
