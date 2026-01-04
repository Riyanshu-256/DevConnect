import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setRequests, removeRequest } from "../store/slices/requestSlice";
import Skeleton from "../components/common/Skeleton";
import RequestCard from "../components/cards/RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // 🔐 Auth Guard
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 📡 Fetch Requests
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/request/received`, {
          withCredentials: true,
        });

        dispatch(setRequests(res.data.data || []));
      } catch (err) {
        err.response?.status === 401
          ? navigate("/login")
          : console.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch, user, navigate]);

  // ✅ Accept / ❌ Reject
  const handleReview = async (status, requestId) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId));
    } catch (err) {
      err.response?.status === 401
        ? navigate("/login")
        : console.error("Request action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton variant="title" className="h-8 w-64" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-modern p-6">
              <div className="flex gap-6">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="title" className="h-6 w-48" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 📭 Empty State
  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card-modern p-12 text-center">
          <h2 className="text-2xl font-bold mb-2">No Connection Requests</h2>
          <p className="text-gray-400">
            You don’t have any pending requests right now.
          </p>
        </div>
      </div>
    );
  }

  // 🚀 Main UI
  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Connection Requests</h1>
          <p className="text-sm text-gray-400">
            {requests.length} pending request(s)
          </p>
        </div>

        {/* Requests List */}
        {requests.map((req) => {
          const requestUser = req.fromUserId;
          if (!requestUser) return null;

          return (
            <RequestCard
              key={req._id}
              user={requestUser}
              loading={actionLoading === req._id}
              onAccept={() => handleReview("accepted", req._id)}
              onReject={() => handleReview("rejected", req._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
