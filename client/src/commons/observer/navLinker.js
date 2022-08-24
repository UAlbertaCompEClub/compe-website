var navLinker = ({block, navBarItem}) => { 
    new IntersectionObserver(() => {
        if (block['isIntersecting'] === true) {
            if (block['intersectionRatio'] === 1) {
                navBarItem.state.isVisible = true;
            }
            else navBarItem.state.isVisible = true;
        }
    }, { threshold: [0, 1] });
    // console.log(block, navBarItem)
    // observer(block, navBarItem);
};

export default navLinker;