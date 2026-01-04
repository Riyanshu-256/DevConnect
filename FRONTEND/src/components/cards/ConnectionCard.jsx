import { BadgeCheck } from "lucide-react";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/c0/a7/76/c0a776ee66443d838aeff236d1d8721b.jpg";

const ConnectionCard = ({ user }) => {
  if (!user) return null;

  const {
    firstName,
    lastName,
    photoUrl,
    about,
    age,
    gender,
    skills = [],
    verified = true,
  } = user;

  return (
    <div
      className="
      group relative rounded-2xl
      bg-gradient-to-b from-[#111827] to-[#0b0f14]
      border border-white/10
      p-6
      shadow-md
      hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300
    "
    >
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={photoUrl || DEFAULT_AVATAR}
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            alt="profile"
            className="
              w-24 h-24 rounded-full object-cover
              ring-4 ring-primary/30
              group-hover:ring-primary/60
              transition
            "
          />
          {verified && (
            <span className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
              <BadgeCheck size={14} className="text-white" />
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center space-y-2">
        <h2 className="text-lg font-semibold text-white">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <p className="text-xs text-gray-400">
            {age && `${age} yrs`}
            {age && gender && " • "}
            {gender}
          </p>
        )}

        <p className="text-sm text-gray-300 line-clamp-2 px-2">
          {about || "Developer on DevConnect"}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="
                  px-3 py-1 rounded-full text-xs
                  bg-primary/10 text-primary
                  border border-primary/20
                "
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-gray-400">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
