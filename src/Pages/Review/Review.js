import React, { useState } from "react";
import { Search, MoreHorizontal, Star } from "lucide-react";

const Review = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Store ratings in state to allow adjustment
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Elafonissi Beach",
      location: "Crete, Greece",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=230&q=80",
      rating: 5,
    },
    {
      id: 2,
      name: "Dragon Bridge",
      location: "Da Nang, Vietnam",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=230&q=80",
      rating: 4,
    },
    {
      id: 3,
      name: "The Marble Mountains",
      location: "Da Nang, Vietnam",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=230&q=80",
      rating: 3,
    },
  ]);

  const recentlyViewed = [
    {
      name: "Hoi An Ancient Town",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=60&q=80",
    },
    {
      name: "My Khe Beach",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=60&q=80",
    },
  ];

  const yourDrafts = [
    {
      name: "Elafonissi Beach",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=60&q=80",
    },
    {
      name: "Dragon Bridge",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=60&q=80",
    },
    {
      name: "The Marble Mountains",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=60&q=80",
    },
  ];

  const RatingStars = ({ rating, onRate }) => {
    return (
      <div className="flex cursor-pointer">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 mx-0.5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onRate(i + 1)}
          />
        ))}
      </div>
    );
  };

  const handleRate = (id, newRating) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, rating: newRating } : loc))
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8">
          Write a review, make someone's trip
        </h1>

        {/* Search Box with Suggestions */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-full max-w-3xl mx-auto relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="What would you like to review?"
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full hover:border-gray-500 focus:border-gray-800 focus:outline-none"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Suggestions Panel */}
            {showSuggestions && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* Recently Viewed Section */}
                <div className="p-4">
                  <h2 className="text-xs font-bold uppercase text-gray-800 mb-3">
                    RECENTLY VIEWED
                  </h2>

                  <div className="space-y-4">
                    {recentlyViewed.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center cursor-pointer hover:bg-gray-50 py-1"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">{item.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Your Drafts Section */}
                <div className="p-4">
                  <h2 className="text-xs font-bold uppercase text-gray-800 mb-3">
                    YOUR DRAFTS
                  </h2>

                  <div className="space-y-4">
                    {yourDrafts.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center cursor-pointer hover:bg-gray-50 py-1"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">{item.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Places Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pick up where you left off
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-lg shadow p-4 relative"
              >
                <div className="flex">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-bold text-lg">{place.name}</h3>
                    <p className="text-gray-600 text-sm">{place.location}</p>
                    <div className="mt-2">
                      <RatingStars
                        rating={place.rating}
                        onRate={(newRating) => handleRate(place.id, newRating)}
                      />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <MoreHorizontal className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
