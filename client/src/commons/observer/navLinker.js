var navLinker = (block, navBarItem) => { 
    var observer = () => {IntersectionObserver((block, navBarItem) => {
            if (block[0]['isIntersecting'] === true) {
                if (block[0]['intersectionRatio'] === 1) {
                    navBarItem.state.isVisible = true;
                }
                else navBarItem.state.isVisible = true;
            }
        }, { threshold: [0, 1] });
    };
    observer(block, navBarItem);
};

export default navLinker;