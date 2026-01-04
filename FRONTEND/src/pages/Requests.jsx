import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setRequests, removeRequest } from "../store/slices/requestSlice";
import RequestCard from "../components/cards/RequestCard";
import { SkeletonRequestCard } from "../components/common/Skeleton";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  /* 🔹 Fetch received requests */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/request/received`, {
          withCredentials: true,
        });

        dispatch(setRequests(res.data.data || []));
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);

  /* 🔹 Accept / Reject handler */
  const handleReview = async (requestId, action) => {
    try {
      setLoadingId(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${action}/${requestId}`,
        {},
        { withCredentials: true }
      );

      // optimistic UI
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  /* 🔹 Loading State */
  if (loading) {
    return (
      <div className="min-h-[80vh] px-6 py-10 bg-base-200">
        <h1 className="text-3xl font-bold mb-8">Connection Requests</h1>

        <div className="space-y-6 max-w-5xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <SkeletonRequestCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-6 py-10 bg-base-200">
      <h1 className="text-3xl font-bold mb-2">Connection Requests</h1>
      <p className="text-sm opacity-70 mb-8">
        {requests.length} pending request(s)
      </p>

      {/* 🔹 Empty State */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 opacity-70">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No requests"
            className="w-28 h-28 mb-6 opacity-80"
          />
          <h2 className="text-xl font-semibold mb-2">No pending requests</h2>
          <p className="text-sm max-w-md">
            When someone sends you a connection request, it will appear here.
          </p>
        </div>
      ) : (
        /* 🔹 Requests List */
        <div className="space-y-6 max-w-5xl mx-auto">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              user={req.fromUserId} // ✅ correct mapping
              loading={loadingId === req._id}
              onAccept={() => handleReview(req._id, "accepted")}
              onReject={() => handleReview(req._id, "rejected")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
