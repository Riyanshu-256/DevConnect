const SkeletonBase = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "skeleton",
    avatar: "skeleton w-24 h-24 rounded-full",
    text: "skeleton h-4 rounded",
    title: "skeleton h-6 rounded w-3/4",
    button: "skeleton h-10 rounded-xl w-24",
  };

  return <div className={`${variants[variant]} ${className}`} />;
};

/* =========================
   Feed → User Card
========================= */
export const SkeletonUserCard = () => (
  <div className="card-modern p-6 space-y-4">
    <SkeletonBase variant="avatar" className="mx-auto" />
    <SkeletonBase variant="title" className="mx-auto" />
    <SkeletonBase variant="text" />
    <SkeletonBase variant="text" className="w-5/6 mx-auto" />
    <div className="flex justify-center gap-2">
      <SkeletonBase variant="button" />
      <SkeletonBase variant="button" />
    </div>
  </div>
);

/* =========================
   Requests → Request Card
========================= */
export const SkeletonRequestCard = () => (
  <div className="rounded-2xl bg-[#0f141a] border border-white/10 p-6 space-y-4">
    <div className="flex items-center gap-4">
      <SkeletonBase variant="avatar" />
      <div className="flex-1 space-y-2">
        <SkeletonBase variant="title" className="w-40" />
        <SkeletonBase variant="text" />
      </div>
    </div>

    <div className="flex gap-3 pt-4">
      <SkeletonBase variant="button" />
      <SkeletonBase variant="button" />
    </div>
  </div>
);

/* =========================
   Connections → Connected User
========================= */
export const SkeletonConnectionCard = () => (
  <div className="rounded-2xl bg-base-100 border border-white/10 p-5 flex items-center gap-4">
    <SkeletonBase variant="avatar" />
    <div className="flex-1 space-y-2">
      <SkeletonBase variant="title" className="w-32" />
      <SkeletonBase variant="text" className="w-1/2" />
    </div>
  </div>
);

export default SkeletonBase;
