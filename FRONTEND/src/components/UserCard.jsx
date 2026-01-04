const UserCard = ({
  user,
  loading = false,
  actionType = null,
  onAction = () => {},
}) => {
  if (!user) return null;

  const {
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    skills = [],
    about,
  } = user;

  return (
    <div className="card w-96 bg-base-300 shadow-xl">
      <figure className="px-10 pt-10">
        <img
          src={
            photoUrl ||
            "https://i.pinimg.com/736x/c0/a7/76/c0a776ee66443d838aeff236d1d8721b.jpg"
          }
          alt="profile"
          className="rounded-full w-40 h-40 object-cover border-4 border-primary"
        />
      </figure>

      <div className="card-body items-center text-center space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            {firstName} {lastName}
          </h2>
          {(age || gender) && (
            <p className="text-sm text-gray-400">
              {age && `${age} years`}
              {age && gender && " • "}
              {gender}
            </p>
          )}
        </div>

        <p className="text-gray-300 text-sm">{about || "No bio available"}</p>

        {skills.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-400 mb-2">Skills</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="badge badge-outline badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4 w-full">
          <button
            className="btn btn-outline btn-error flex-1"
            onClick={() => onAction(user._id, "ignored")}
            disabled={loading}
          >
            {loading && actionType === "ignored" ? "..." : "✕ Skip"}
          </button>

          <button
            className="btn btn-primary flex-1"
            onClick={() => onAction(user._id, "interested")}
            disabled={loading}
          >
            {loading && actionType === "interested" ? "..." : "✓ Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
