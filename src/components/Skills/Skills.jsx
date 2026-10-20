// src/components/Skills/Skills.jsx
import React, { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { supabase } from "../../lib/supabase";
import { SkillsInfo } from "../../constants"; // fallback

// Build fallback data from constants
const FALLBACK_SKILLS = SkillsInfo.map(cat => ({
  title: cat.title,
  skills: cat.skills.map(s => ({ name: s.name, logo: s.logo })),
}));

const groupByCategory = (skills) => {
  const categories = {};
  skills.forEach(skill => {
    if (!categories[skill.category]) categories[skill.category] = [];
    categories[skill.category].push(skill);
  });
  return Object.entries(categories).map(([title, skills]) => ({ title, skills }));
};

const Skills = () => {
  const [categories, setCategories] = useState(FALLBACK_SKILLS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("display_order");

      if (!error && data && data.length > 0) {
        setCategories(groupByCategory(data));
      }
      setLoading(false);
    };
    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[20vw] font-sans bg-skills-gradient clip-path-custom"
    >
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">SKILLS</h2>
        <div className="w-24 h-1 bg-[#8245ec] mx-auto mt-2"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          A collection of my technical skills and expertise honed through various projects and experiences
        </p>
      </div>

      {/* Skill Categories */}
      <div className="flex flex-wrap gap-1 lg:gap-5 py-10 justify-between">
        {categories.map((category) => (
          <div
            key={category.title}
            className="bg-gray-900 backdrop-blur-md px-6 sm:px-10 py-8 sm:py-6 mb-10 w-full sm:w-[48%] rounded-2xl border border-white shadow-[0_0_20px_1px_rgba(130,69,236,0.3)]"
          >
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-400 mb-4 text-center">
              {category.title}
            </h3>
            <Tilt
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              perspective={1000}
              scale={1.05}
              transitionSpeed={1000}
              gyroscope={true}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-center space-x-2 bg-transparent border-2 border-gray-700 rounded-3xl py-2 px-2 sm:py-2 sm:px-2 text-center"
                  >
                    {(skill.logo || skill.logo_url) && (
                      <img
                        src={skill.logo || skill.logo_url}
                        alt={`${skill.name} logo`}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="text-xs sm:text-sm text-gray-300">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </Tilt>
          </div>
        ))}
      </div>

      {loading && categories === FALLBACK_SKILLS && (
        <p className="text-center text-gray-600 text-sm">Loading latest skills...</p>
      )}
    </section>
  );
};

export default Skills;
