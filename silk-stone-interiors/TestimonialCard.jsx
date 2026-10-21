const TestimonialCard = ({ quote, author, location }) => (
  <div className="text-center">
    <p className="font-display text-lg italic text-foreground leading-relaxed mb-6">
      "{quote}"
    </p>
    <p className="font-body text-sm font-medium text-foreground">{author}</p>
    <p className="font-body text-xs text-muted-foreground mt-1">{location}</p>
  </div>
);

export default TestimonialCard;