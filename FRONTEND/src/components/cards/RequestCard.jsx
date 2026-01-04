import { Check, X, BadgeCheck, Loader2 } from "lucide-react";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/c0/a7/76/c0a776ee66443d838aeff236d1d8721b.jpg";

const RequestCard = ({ user, loading, onAccept, onReject }) => {
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
    <div className="rounded-2xl bg-[#0f141a] border border-white/10 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row gap-6">
      {/* Avatar */}
      <img
        src={photoUrl || DEFAULT_AVATAR}
        onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/40"
      />

      {/* User Info */}
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-semibold text-white flex items-center gap-1">
          {firstName} {lastName}
          {verified && <BadgeCheck size={18} className="text-primary" />}
        </h2>

        {(age || gender) && (
          <p className="text-sm text-gray-400">
            {age && `${age} years`}
            {age && gender && " • "}
            {gender}
          </p>
        )}

        <p className="text-sm text-gray-300 line-clamp-2">
          {about || "No bio available"}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
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
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col justify-center gap-3 sm:min-w-[130px] border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
        {/* Accept Button */}
        <button
          disabled={loading}
          onClick={onAccept}
          className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold
      transition-all duration-200
      ${
        loading
          ? "bg-blue-500/50 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] active:scale-95"
      }`}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Check size={16} />
              Accept
            </>
          )}
        </button>

        {/* Reject Button */}
        <button
          disabled={loading}
          onClick={onReject}
          className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold
      border transition-all duration-200
      ${
        loading
          ? "border-red-500/30 text-red-400/50 cursor-not-allowed"
          : "border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/70 active:scale-95"
      }`}
        >
          <X size={16} />
          Reject
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
