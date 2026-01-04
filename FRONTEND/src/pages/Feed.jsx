import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../store/slices/feedSlice";
import UserCard from "../components/cards/UserCard";
import { Users, Info } from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
        dispatch(addFeed(res.data.data || res.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [dispatch, user]);

  /* 🔹 Handle Ignore / Interested */
  const handleAction = async (toUserId, action) => {
    try {
      setActionLoading(true);

      await axios.post(
        `${BASE_URL}/request/send/${action}/${toUserId}`,
        {},
        { withCredentials: true }
      );

      // Optimistic update – remove from feed
      dispatch(addFeed(feed.filter((u) => u._id !== toUserId)));
    } catch (err) {
      console.error("Action failed:", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* 🔹 Loading */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  /* 🔹 Empty Feed */
  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="text-center">
          <Users size={40} className="mx-auto text-primary mb-3" />
          <h2 className="text-xl font-semibold">No more developers in feed</h2>
          <p className="text-sm text-base-content/60 mt-1">
            You’ve interacted with all available profiles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-10 bg-base-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Developer Feed</h1>
          <p className="text-base-content/60 mt-2">
            Discover developers you haven’t connected with yet
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-base-content/50 mt-3">
            <Info size={14} />
            Based on availability, connections & requests
          </div>
        </div>

        {/* Feed Card */}
        <div className="flex justify-center">
          <UserCard
            user={feed[0]}
            loading={actionLoading}
            onIgnore={() => handleAction(feed[0]._id, "ignored")}
            onInterested={() => handleAction(feed[0]._id, "interested")}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
