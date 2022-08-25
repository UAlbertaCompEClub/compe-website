var navLinker = (block, setBlock, blockId) => { 
    var observer = new IntersectionObserver((entries) => {
        if (entries[0]['isIntersecting'] === true) {
            setBlock(blockId);
        }
    }, { threshold: [0.51, 1] });
    observer.observe(block);
};

export default navLinker;