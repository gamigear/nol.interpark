import Link from 'next/link';
import { adminNavigation } from './admin-navigation';

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <Link href="/admin/dashboard" className="admin-brand" aria-label="world.nol admin home">
          <span className="admin-brand__mark">nol</span>
          <span>
            <strong>world.nol CMS</strong>
            <small>Internal admin surface</small>
          </span>
        </Link>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {adminNavigation.map((group) => (
          <section key={group.title} className="admin-nav-group">
            <p className="admin-nav-group__label">{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="admin-nav-link">
                    <span>{item.title}</span>
                    {item.description ? <small>{item.description}</small> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <p className="admin-sidebar__build-note">
          MVP surface — modules with save flows: Homepage, Navigation, Promos.
        </p>
        <p className="admin-sidebar__build-note">
          Use Dashboard for status overview; edit routes are best for direct content changes.
        </p>
        <p className="admin-sidebar__build-note">
          Tip: if you are validating one change only, start with the module route instead of scanning the full dashboard first.
        </p>
      </div>
    </aside>
  );
}
