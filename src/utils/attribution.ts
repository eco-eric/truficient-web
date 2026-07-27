/**
 * First-touch marketing attribution capture.
 *
 * On the first visit we snapshot the campaign context (UTM params, click IDs,
 * referrer, landing page) into localStorage and keep it for the life of the
 * browser. Subsequent visits do NOT overwrite it — first-touch wins — UNLESS a
 * later visit carries a paid/click signal (gclid, fbclid, or utm_source) that
 * the stored record lacks; in that case we merge the fresher campaign fields in.
 *
 * getAttribution() reshapes the stored record to the DB column names so it can
 * be spread directly into Supabase inserts. Every field is optional and defaults
 * to null — attribution must never block a form submission.
 */

const STORAGE_KEY = 'tf_attribution';
const SITE_DOMAIN = 'truficient.com';

interface StoredAttribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
  landing_page: string | null;
  captured_at: string;
}

/** DB column shape spread into Supabase inserts. */
export interface AttributionColumns {
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  attribution_captured_at: string | null;
}

/** Read the referrer only when it's an external domain (not truficient.com). */
const readExternalReferrer = (): string | null => {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const host = new URL(ref).hostname;
    if (host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`)) return null;
    return ref;
  } catch {
    return null;
  }
};

/** Build the attribution record from the current page context. */
const readCurrentContext = (): StoredAttribution => {
  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key) || null;
  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_term: get('utm_term'),
    utm_content: get('utm_content'),
    gclid: get('gclid'),
    fbclid: get('fbclid'),
    referrer: readExternalReferrer(),
    landing_page: window.location.pathname + window.location.search,
    captured_at: new Date().toISOString(),
  };
};

/** True when a record carries a paid/click signal worth attributing. */
const hasClickSignal = (r: {
  gclid: string | null;
  fbclid: string | null;
  utm_source: string | null;
}): boolean => Boolean(r.gclid || r.fbclid || r.utm_source);

/**
 * Capture first-touch attribution. Safe to call on every load; the first-touch
 * rule keeps the earliest record unless a later visit brings a click signal the
 * stored record lacks.
 */
export const captureAttribution = (): void => {
  try {
    const current = readCurrentContext();

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return;
    }

    let stored: StoredAttribution;
    try {
      stored = JSON.parse(raw) as StoredAttribution;
    } catch {
      // Corrupt record — replace it.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return;
    }

    // First-touch wins, EXCEPT when the new visit has a click signal and the
    // stored record has none — then merge the new campaign fields in.
    if (hasClickSignal(current) && !hasClickSignal(stored)) {
      const merged: StoredAttribution = {
        ...stored,
        utm_source: current.utm_source,
        utm_medium: current.utm_medium,
        utm_campaign: current.utm_campaign,
        utm_term: current.utm_term,
        utm_content: current.utm_content,
        gclid: current.gclid,
        fbclid: current.fbclid,
        referrer: current.referrer,
        landing_page: current.landing_page,
        captured_at: current.captured_at,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    // Otherwise keep the existing first-touch record untouched.
  } catch {
    // Never let attribution capture throw.
  }
};

/**
 * Return the stored attribution shaped to the DB column names, with nulls for
 * anything absent. Never throws.
 */
export const getAttribution = (): AttributionColumns => {
  const empty: AttributionColumns = {
    landing_page: null,
    referrer: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    fbclid: null,
    attribution_captured_at: null,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const stored = JSON.parse(raw) as Partial<StoredAttribution>;
    return {
      landing_page: stored.landing_page ?? null,
      referrer: stored.referrer ?? null,
      utm_source: stored.utm_source ?? null,
      utm_medium: stored.utm_medium ?? null,
      utm_campaign: stored.utm_campaign ?? null,
      utm_term: stored.utm_term ?? null,
      utm_content: stored.utm_content ?? null,
      gclid: stored.gclid ?? null,
      fbclid: stored.fbclid ?? null,
      attribution_captured_at: stored.captured_at ?? null,
    };
  } catch {
    return empty;
  }
};
