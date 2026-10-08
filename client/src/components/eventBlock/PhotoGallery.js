import gallery from "../../data/gallery.json";

// A still grid instead of an autoplaying slider: every photo is visible, and nothing moves on its own.
const PhotoGallery = () => {
  if (gallery.length === 0) return null;

  return (
    <div className="gallery">
      <h3 className="subhead">From past events</h3>
      <ul className="gallery__grid">
        {gallery.map((photo, index) => (
          <li
            key={photo.src}
            className={`gallery__item${
              index === 0 && gallery.length >= 3 ? " gallery__item--lead" : ""
            }`}
          >
            <img
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotoGallery;
