function PuzzleTray({ children }) {
  return (
    <div className="mt-6 bg-pink-100 rounded-xl p-3">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PuzzleTray;
