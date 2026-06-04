import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import TimelineCard from "@/app/components/timeline/timeline-card";
import { profile } from "@/app/data/profile";

export default function TimelineSection() {
  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <SectionHeading icon={faTimeline} title="Timeline" id="timeline" />

        <div className="timeline-spine-wrapper" style={{ marginTop: "2.5rem" }}>
          {profile.timeline.map((entry, index) => (
            <TimelineCard key={`${entry.institution}-${entry.title}`} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
