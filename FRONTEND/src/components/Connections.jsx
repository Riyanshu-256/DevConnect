import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { SkeletonConnectionCard } from "./Skeleton";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      dispatch(addConnections(res.data.data || []));
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load connections");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  if (loading) {
    return (
      <div className="px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonConnectionCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchConnections} className="btn-modern">
          Retry
        </button>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card-modern p-12 text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold">No Connections Yet</h2>
          <p className="text-gray-400 mt-2">
            Accept requests to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {connections.map((connection) => (
        <div key={connection._id} className="card-modern p-6 text-center">
          <img
            src={connection.photoUrl || DEFAULT_AVATAR}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          />

          <h2 className="font-semibold text-lg">
            {connection.firstName} {connection.lastName}
          </h2>

          {(connection.age || connection.gender) && (
            <p className="text-xs text-gray-400 mt-1">
              {connection.age && `${connection.age} years`}
              {connection.age && connection.gender && " • "}
              {connection.gender}
            </p>
          )}

          {connection.about && (
            <p className="text-sm text-gray-300 mt-3 line-clamp-3">
              {connection.about}
            </p>
          )}

          {connection.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {connection.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-300 text-xs border border-primary-500/30"
                >
                  {skill}
                </span>
              ))}
              {connection.skills.length > 4 && (
                <span className="px-3 py-1 rounded-lg bg-dark-border text-gray-400 text-xs">
                  +{connection.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Connections;
