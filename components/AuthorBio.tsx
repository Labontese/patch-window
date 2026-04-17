import Link from 'next/link'

export default function AuthorBio() {
  return (
    <aside className="author-bio" aria-label="About the author">
      <p className="author-bio__name">
        <Link href="/about/daniel" data-umami-event="author-bio-click">Daniel Gustafsson</Link>
      </p>
      <p>
        Daniel Gustafsson has run Linux since 1995. He tests everything he writes
        about on real hardware — a three-node Proxmox cluster on Dell PowerEdge
        servers, dual Juniper EX4200 switches, K3s, Wazuh. He knows a little
        about most things and writes about the ones he has actually run. Patch
        Window covers Linux, networking, containers, DevOps, and AI in production
        environments.
      </p>
    </aside>
  )
}
