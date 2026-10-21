import { Link } from "react-router-dom";

const ProjectCard = ({ img, title, category, width, height }) => (
  <Link to="/portfolio" className="group">
    <div className="image-reveal mb-4">
      <img
        src={img}
        alt={title}
        className="w-full h-[400px] object-cover"
        loading="lazy"
        width={width}
        height={height}
      />
    </div>
    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
      {category}
    </p>
    <h3 className="font-display text-xl font-medium text-foreground group-hover:text-accent transition-colors">
      {title}
    </h3>
  </Link>
);

export default ProjectCard;