import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaSection = ({ title, description, linkTo, linkText }) => (
  <section className="section-padding bg-accent text-accent-foreground text-center">
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
        {title}
      </h2>
      <p className="font-body text-accent-foreground/80 mb-8">
        {description}
      </p>
      <Link
        to={linkTo}
        className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
      >
        {linkText}
        <ArrowRight size={16} />
      </Link>
    </div>
  </section>
);

export default CtaSection;