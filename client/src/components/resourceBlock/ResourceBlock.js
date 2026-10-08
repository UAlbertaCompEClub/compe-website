import React, { useEffect } from "react";
import navLinker from "../pageState/observer/navLinker";
import resources from "../../data/resources.json";
import site from "../../data/site.json";
import "./ResourceBlock.css";

const id = "resources";

function groupByCategory(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  }
  return [...groups.entries()];
}

const ResourceBlock = React.forwardRef((props, ref) => {
  useEffect(
    () => navLinker(ref.current, props.setBlock, id),
    [ref, props.setBlock]
  );

  const groups = groupByCategory(resources);

  return (
    <section
      className="block block--tint"
      id={id}
      ref={ref}
      aria-labelledby="resources-title"
    >
      <div className="wrap resources">
        <div className="resources__intro">
          <header className="section-head">
            <p className="eyebrow">Resources</p>
            <h2 id="resources-title">
              Uncover the black box of the tech industry
            </h2>
            <p className="lede">
              Over the years, our club has compiled resources to help CompE
              students with internships, interviews, resumes and more.
            </p>
            {site.resourcesUrl && (
              <a
                className="btn btn--moss resources__all"
                href={site.resourcesUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse all resources on GitHub
              </a>
            )}
          </header>

          <aside className="review" aria-labelledby="review-title">
            <h3 id="review-title">Free resume reviews</h3>
            <p>
              Experienced upper-year students review resumes throughout the
              year. Join the Discord and ask in <code>#resume-review</code>.
            </p>
            {site.discordUrl && (
              <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">
                Join the Discord<span aria-hidden="true"> ↗</span>
              </a>
            )}
          </aside>
        </div>

        {groups.length > 0 && (
          <div className="resources__groups">
            {groups.map(([category, items]) => (
              <div key={category} className="resource-group">
                <h3 className="resource-group__title">{category}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item.title}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      ) : (
                        <span>{item.title}</span>
                      )}
                      {item.description && <p>{item.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default ResourceBlock;
