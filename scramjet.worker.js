// Scramjet + search fix – Cloudflare Worker (free)
function b64enc(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function b64dec(str) {
  return atob(str.replace(/\-/g, '+').replace(/\_/g, '/'));
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const enc = url.pathname.split('/')[1];
    if (!enc) return new Response('Missing target', { status: 400 });

    const target = b64dec(enc);
    const outReq = new Request(target, req);
    outReq.headers.set('Origin', new URL(target).origin);

    let resp = await fetch(outReq);

    // ---- only touch HTML pages ----
    const ctype = resp.headers.get('content-type') || '';
    if (!ctype.includes('text/html')) return resp;

    let html = await resp.text();

    // 1. Rewrite forms so they POST back through the proxy
    html = html.replace(
      /<form([^>]*)action=["'](https?:\/\/[^"']+)["']/gi,
      (_, attrs, action) => {
        const encAction = b64enc(action);
        const newAction = ${url.origin}/${encAction};
        return <form${attrs} action="${newAction}";
      }
    );

    // 2. Rewrite absolute links to stay inside proxy
    html = html.replace(
      /href=["'](https?:\/\/[^"']+)["']/gi,
      (_, href) => href="${url.origin}/${b64enc(href)}"
    );

    return new Response(html, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers
    });
  }
}
