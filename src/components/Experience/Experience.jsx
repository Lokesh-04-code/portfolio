import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { experiences as FALLBACK } from "../../constants";

// Convert constants format → DB format for fallback rendering
const FALLBACK_EXP = FALLBACK.map((e, i) => ({
  id: e.id,
  role: e.role,
  company: e.company,
  start_date: e.date?.split(' - ')[0] || '',
  end_date: e.date?.split(' - ')[1] || '',
  is_current: false,
  description: e.desc,
  skills: e.skills || [],
  logo_url: null,
  display_order: i,
  _img: e.img, // original import for fallback
}));

const Experience = () => {
  const [experiences, setExperiences] = useState(FALLBACK_EXP);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order");
      if (!error && data && data.length > 0) {
        setExperiences(data);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      id="experience"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-2"
    >
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">EXPERIENCE</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          A collection of my work experience and the roles I have taken in various organizations
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {/* Experience Entries */}
        {experiences.map((experience, index) => (
          <div
            key={experience.id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"
            }`}
          >
            {/* Content Section */}
            <div
              className={`w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                index % 2 === 0 ? "sm:ml-0" : "sm:mr-0"
              } sm:ml-44 sm:mr-44 ml-8 transform transition-transform duration-300 hover:scale-105`}
            >
              {/* Flex container for image and text */}
              <div className="flex items-center space-x-6">
                {/* Company Logo/Image */}
                <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                  {(experience.logo_url || experience._img) ? (
                    <img
                      src={experience.logo_url || experience._img}
                      alt={experience.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-900 flex items-center justify-center text-white font-bold text-xl">
                      {experience.company?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Role, Company Name, and Date */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {experience.role}
                    </h3>
                    <h4 className="text-md sm:text-sm text-gray-300">
                      {experience.company}
                    </h4>
                  </div>
                  {/* Date at the bottom */}
                  <p className="text-sm text-gray-500 mt-2">
                    {experience.date ||
                      `${experience.start_date}${experience.is_current ? ' - Present' : experience.end_date ? ` - ${experience.end_date}` : ''}`
                    }
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-400">{experience.desc || experience.description}</p>
              <div className="mt-4">
                <h5 className="font-medium text-white">Skills:</h5>
                <ul className="flex flex-wrap mt-2">
                  {(experience.skills || []).map((skill, i) => (
                    <li
                      key={i}
                      className="bg-[#8245ec] text-gray-300 px-4 py-1 text-xs sm:text-sm rounded-lg mr-2 mb-2 border border-gray-400"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
