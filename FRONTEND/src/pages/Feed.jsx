import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Users, UserPlus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addFeed, updateFeedUserStatus } from "../store/slices/feedSlice";
import UserCard from "../components/cards/UserCard";
import { SkeletonUserCard } from "../components/common/Skeleton";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  /* 🔹 Fetch Feed */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFeed = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/feed`, {
          withCredentials: true,
        });
        dispatch(addFeed(res.data.data || res.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [dispatch, user]);

  /* 🔹 Send Action */
  const handleAction = async (toUserId, action) => {
    try {
      setActionLoadingId(toUserId);

      await axios.post(
        `${BASE_URL}/request/send/${action}/${toUserId}`,
        {},
        { withCredentials: true }
      );

      dispatch(
        updateFeedUserStatus({
          userId: toUserId,
          status: action,
        })
      );
    } catch (err) {
      console.error("Action failed:", err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  /* 🔹 Loader */
  if (loading) {
    return (
      <div className="min-h-[80vh] px-4 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonUserCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* 🔹 EMPTY FEED (Production UI) */
  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 mb-6">
          <Users size={36} className="text-primary" />
        </div>

        <h1 className="text-2xl font-semibold text-white">
          No Developers in Your Feed Yet
        </h1>

        <p className="text-gray-400 max-w-md mt-3">
          Your feed will show developers who match your skills and interests.
          Start connecting to grow your professional network on DevConnect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-blue-600 hover:bg-blue-500 text-white font-medium
            transition active:scale-95"
          >
            <UserPlus size={18} />
            Complete Profile
          </button>

          <button
            onClick={() => navigate("/requests")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            border border-white/15 text-gray-300 hover:bg-white/5
            transition active:scale-95"
          >
            <Sparkles size={18} />
            View Requests
          </button>
        </div>
      </div>
    );
  }

  /* 🔹 NORMAL FEED */
  return (
    <div className="min-h-[80vh] px-4 py-10 bg-base-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {feed.map((u) => (
          <UserCard
            key={u._id}
            user={u}
            loading={actionLoadingId === u._id}
            onIgnore={() => handleAction(u._id, "ignored")}
            onInterested={() => handleAction(u._id, "interested")}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
