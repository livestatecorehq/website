// Anonymous, invitation-specific milestones for the college pilot.
(async function trackInvitation() {
  const token = new URLSearchParams(location.hash.slice(1)).get('i');
  if (!/^[0-9a-f]{20}$/.test(token || '') || !window.crypto?.subtle) return;
  const allowed = new Set([
  "ad976387f1ef73fbef9d98007ab24a05cd4f41e7db1bbe536ec01e4539efc5c9",
  "02231a6d4d839831aae75fc162af2b9bf98ebbf34612e7da1a4b01e6d42b8f45",
  "593063fc31eaf9bf663f5aeb2a4c7b0fff0112b2d42a8c9535cf76a96f828fcd",
  "dcc3c51342b00c392755cf0a6cd0dcb294a78372bdda3880b98ab12fa153a1b1",
  "9c71fc490019dfa859ab39e5686a9fd44266f6879643a152d1468e8a3f5fe05c",
  "d687baed62978929590a469fabb6206b107eb3074502315ba6d3732c8f63f189",
  "0007cd7ed910a750c2d0e8b35cf621a42cba9f17028919a4023b82ecb9abb409",
  "30176bd3f8da437e9b90b66b32eecd2803c8875e0b6133938b7307e84c9791aa",
  "3f46dd55913ff241e8239ce472be378395ed430099ec03dd5f5d3717e2197cb5",
  "368730517baa8b696acd0129a93cbea0003d78daca915564b6ac74a52b2362ae",
  "7c858ae9bd90af9efb7f3dc732c1a733fbb4ec22806d090c6487fe4f16ff941c"
]);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)));
  if (!allowed.has(Array.from(digest, n => n.toString(16).padStart(2, '0')).join(''))) return;
  const endpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSeJxp2WMDSkzrKBdDYpuFwNsgV_xDHqVz2Qu3nfq8Nlz-_7CQ/formResponse';
  const sent = new Set();
  const stages = ['visit', 'add', 'three-items', 'review', 'invoice'];
  async function record(stage) {
    if (!stages.includes(stage) || sent.has(stage)) return;
    const key = 'cagestock-invite:' + token + ':' + stage;
    try { if (sessionStorage.getItem(key)) return; } catch {}
    sent.add(stage);
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', credentials: 'omit',
        referrerPolicy: 'no-referrer', keepalive: true,
        body: new URLSearchParams({'entry.1883295453': token + '|' + stage}) });
      try { sessionStorage.setItem(key, '1'); } catch {}
    } catch { sent.delete(stage); }
  }
  document.getElementById('invite-disclosure').hidden = false;
  window.addEventListener('cagestock:activity', event => record(event.detail));
  const visit = () => { if (document.visibilityState === 'visible') record('visit'); };
  document.addEventListener('visibilitychange', visit);
  visit();
})().catch(() => {});
