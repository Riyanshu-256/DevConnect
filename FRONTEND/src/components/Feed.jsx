import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";
import { SkeletonCard } from "./Skeleton";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Fetch feed
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const getFeed = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/feed`, {
          withCredentials: true,
        });

        dispatch(addFeed(res.data.data || res.data));
      } catch (err) {
        console.error("Feed error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [dispatch, user]);

  // Handle Skip / Connect
  const handleAction = async (toUserId, status) => {
    try {
      setActionLoading(true);
      setActionType(status);

      await axios.post(
        `${BASE_URL}/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );

      // SAFE removal using latest state
      dispatch(addFeed(feed.filter((u) => u._id !== toUserId)));
    } catch (err) {
      console.error(
        "Action error:",
        err.response?.data?.message || err.message
      );
    } finally {
      setActionLoading(false);
      setActionType(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  // Empty feed
  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <div className="card-modern p-12 max-w-md">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            No More Profiles
          </h2>
          <p className="text-gray-400">
            You've seen all available developers. Check back later for new
            connections!
          </p>
        </div>
      </div>
    );
  }

  // Show first card (Tinder-style)
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <UserCard
        user={feed[0]}
        loading={actionLoading}
        actionType={actionType}
        onAction={handleAction}
      />
    </div>
  );
};

export default Feed;
