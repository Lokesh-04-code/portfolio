import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { education as FALLBACK_EDUCATION } from "../../constants";

// Convert constants format for fallback
const FALLBACK = FALLBACK_EDUCATION.map((e, i) => ({
  id: e.id,
  institution: e.school,
  degree: e.degree,
  field_of_study: null,
  start_date: e.date?.split(' - ')[0] || '',
  end_date: e.date?.split(' - ')[1] || '',
  grade: e.grade,
  description: e.desc,
  logo_url: null,
  _img: e.img, // original import
  display_order: i,
}));

const Education = () => {
  const [educations, setEducations] = useState(FALLBACK);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order");
      if (!error && data && data.length > 0) {
        setEducations(data);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      id="education"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3"
    >
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">EDUCATION</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          My education has been a journey of learning and development. Here are the details of my academic background
        </p>
      </div>

      {/* Education Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {/* Education Entries */}
        {educations.map((edu, index) => (
          <div
            key={edu.id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
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
                {/* School Logo/Image */}
                <div className="w-24 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                  {(edu.logo_url || edu._img) ? (
                    <img
                      src={edu.logo_url || edu._img}
                      alt={edu.institution || edu.school}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-900 flex items-center justify-center text-white font-bold text-xl">
                      {(edu.institution || edu.school)?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Degree, School Name, and Date */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-xl font-semibold text-white">
                      {edu.degree}
                    </h3>
                    <h4 className="text-md sm:text-sm text-gray-300">
                      {edu.institution || edu.school}
                    </h4>
                  </div>
                  {/* Date at the bottom */}
                  <p className="text-sm text-gray-500 mt-2">
                    {edu.date ||
                      `${edu.start_date}${edu.end_date ? ` - ${edu.end_date}` : ''}`
                    }
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-400 font-bold">
                Grade: {edu.grade}
              </p>
              <p className="mt-4 text-gray-400">{edu.desc || edu.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
