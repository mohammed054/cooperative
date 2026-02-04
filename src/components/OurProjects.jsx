// src/components/OurProjects.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import PageIntro from "./PageIntro";

export default function OurProjects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Weddings", "Corporate", "Birthday", "Product Launch"];
  const projects = [
    {
      id: 1,
      title: "Luxury Wedding",
      category: "Weddings",
      image: "/cooperative/images/event1.jpg",
      description: "Elegant wedding with 500+ guests and stunning decor",
    },
    {
      id: 2,
      title: "Corporate Gala",
      category: "Corporate",
      image: "/cooperative/images/event2.jpg",
      description: "Exclusive gala dinner for top executives",
    },
    {
      id: 3,
      title: "Birthday Bash",
      category: "Birthday",
      image: "/cooperative/images/event3.jpg",
      description: "Fun and colorful themed birthday celebration",
    },
    {
      id: 4,
      title: "Product Launch",
      category: "Product Launch",
      image: "/cooperative/images/event1.jpg",
      description: "Innovative product reveal with VIP guests",
    },
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div id="our-projects" className="w-full min-h-screen bg-surface-3">
      <PageIntro
        eyebrow="Projects"
        title="A gallery of recent rooms and builds."
        description="Selected visuals from corporate summits, launches, and high‑touch hospitality events across the UAE."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="btn-primary text-sm">
            Request a proposal
          </Link>
          <Link to="/work" className="btn-secondary text-sm">
            View case studies
          </Link>
        </div>
      </PageIntro>

      {/* Categories */}
      <section className="py-10 px-6 flex justify-center gap-4 flex-wrap bg-surface">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border transition text-sm font-semibold ${
              activeCategory === cat ? "bg-ink text-white border-ink" : "border-border text-ink-muted hover:text-ink"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Projects Grid */}
      <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-surface">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer border border-border"
          >
            <img
              src={proj.image}
              alt={proj.title}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-center p-4 transition">
              <h2 className="text-white text-xl font-semibold">{proj.title}</h2>
              <p className="text-white mt-2 text-sm">{proj.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Projects Carousel */}
      <section className="py-10 px-6 bg-surface-3">
        <h2 className="text-3xl font-semibold text-center mb-6 text-ink font-serif">Featured projects</h2>
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-border bg-surface-2">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4">
                  <h3 className="text-white font-semibold">{proj.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center bg-surface">
        <h2 className="text-4xl font-semibold mb-4 text-ink font-serif">Plan your next event with a calm team.</h2>
        <p className="text-ink-muted mb-8">
          Share your dates and priorities. We will respond with a clear scope and timeline.
        </p>
        <Link to="/contact" className="btn-primary px-8 py-4">
          Book a consultation
        </Link>
      </section>
    </div>
  );
}
