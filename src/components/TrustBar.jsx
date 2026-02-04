import React from "react";

const TrustBar = () => {
  const items = [
    { title: "UAE-Wide Coverage", desc: "On-site teams across major emirates" },
    { title: "End-to-End Delivery", desc: "Planning, rentals, setup, and support" },
    { title: "Premium Inventory", desc: "Curated AV, staging, lighting, and seating" },
    { title: "Dedicated Producers", desc: "One point of contact from start to finish" },
  ];

  return (
    <section className="bg-bg-soft border-y border-primary-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-text-muted mb-3">
              Trusted Event Partner
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-ghaimuae-primary">
              Built for demanding event teams who need absolute reliability
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {items.map((item) => (
              <div key={item.title} className="min-w-0">
                <p className="text-sm font-semibold text-ghaimuae-primary">
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-text-muted mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
