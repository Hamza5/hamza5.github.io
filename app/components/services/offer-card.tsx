"use client";

import Illustration from "@/app/components/illustration";
import type { LocalizedOffer } from "@/app/hooks/use-localized-services";

/**
 * An offer is a statement of what can be built, not a page of its own: the four
 * offers have no detail route to go to. So this card is a plain <article> with
 * no link and no "read more" affordance, which would be a dead control pointing
 * nowhere. The sector cards below it are real links, because each sector does
 * have its own page.
 *
 * The layout is a split: copy on the reading side, art on the trailing side. The
 * illustration is decorative — the title already names the service, so the art
 * carries an empty alt rather than repeating it to a screen reader.
 */
export default function OfferCard({ offer }: { offer: LocalizedOffer }) {
  return (
    <article className="art-card art-card--offer">
      <div className="art-card-body">
        <h3 className="art-card-title">{offer.title}</h3>
        <p className="art-card-text">{offer.description}</p>
      </div>
      <div className="art-card-media">
        <Illustration
          src={offer.image.src}
          width={offer.image.width}
          height={offer.image.height}
          alt=""
        />
      </div>
    </article>
  );
}
