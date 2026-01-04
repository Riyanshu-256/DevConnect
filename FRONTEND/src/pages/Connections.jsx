import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../store/slices/connectionSlice";
import ConnectionCard from "../components/cards/ConnectionCard";
import { SkeletonConnectionCard } from "../components/common/Skeleton";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return setLoading(false);

    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });

        dispatch(addConnections(res.data.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonConnectionCard key={i} />
        ))}
      </div>
    );
  }

  if (!connections.length) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          You don’t have any connections yet
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white">Your Connections</h1>
          <p className="text-gray-400 mt-2">
            Developers you are connected with
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {connections.map((user) => (
            <ConnectionCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
