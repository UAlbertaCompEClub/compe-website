// Marks a section as the current one in the nav while it crosses the middle of the viewport.
// Returns a cleanup function for useEffect.
var navLinker = (block, setBlock, blockId) => {
  var observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setBlock(blockId);
      }
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  observer.observe(block);
  return () => observer.disconnect();
};

export default navLinker;
