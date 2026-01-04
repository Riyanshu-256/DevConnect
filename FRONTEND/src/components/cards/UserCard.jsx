import { X, UserPlus, BadgeCheck, Loader2 } from "lucide-react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const statusStyles = {
  interested: "bg-green-500/20 text-green-400 border-green-500/30",
  ignored: "bg-red-500/20 text-red-400 border-red-500/30",
};

const UserCard = ({ user, onIgnore, onInterested, loading = false }) => {
  if (!user) return null;

  const {
    firstName,
    lastName,
    photoUrl,
    about,
    skills = [],
    verified = true,
    status, // 👈 interested | ignored
  } = user;

  const isActionTaken = Boolean(status);

  return (
    <div className="relative w-[360px] rounded-2xl bg-[#0f141a] border border-white/10 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* 🔖 Status Badge */}
      {status && (
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs rounded-full border ${statusStyles[status]}`}
        >
          {status === "interested" ? "Interested" : "Ignored"}
        </span>
      )}

      {/* ❌ Quick Ignore Icon */}
      <button
        disabled={loading || isActionTaken}
        onClick={onIgnore}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition disabled:opacity-40"
      >
        <X size={18} />
      </button>

      {/* 👤 Avatar */}
      <div className="relative w-28 h-28 mx-auto mb-4">
        <img
          src={photoUrl || DEFAULT_AVATAR}
          alt="profile"
          onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          className="w-full h-full rounded-full object-cover ring-2 ring-primary/40"
        />
      </div>

      {/* 🧑 Name */}
      <h2 className="text-lg font-semibold text-white flex items-center justify-center gap-1">
        {firstName} {lastName}
        {verified && <BadgeCheck size={16} className="text-primary" />}
      </h2>

      {/* 📝 Bio */}
      <p className="text-sm text-gray-400 mt-2 line-clamp-2 px-2">
        {about || "No bio available"}
      </p>

      {/* 🏷 Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* 🔘 Actions */}
      <div className="flex gap-3 mt-6">
        {/* Ignore */}
        <button
          disabled={loading || isActionTaken}
          onClick={onIgnore}
          className="flex-1 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
        >
          {loading && !status ? (
            <Loader2 className="animate-spin mx-auto" size={16} />
          ) : (
            "Ignore"
          )}
        </button>

        {/* Interested */}
        <button
          disabled={loading || isActionTaken}
          onClick={onInterested}
          className="flex-1 py-2 rounded-xl bg-primary text-black font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {loading && !status ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <UserPlus size={16} />
              Interested
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
