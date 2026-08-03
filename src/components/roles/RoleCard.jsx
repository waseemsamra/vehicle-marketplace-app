import React from 'react';
import { createRole } from '../../models/Role';
import RoleBadge from './RoleBadge';

// OOP at the component level. React class components (unlike function
// components) support classical inheritance, so we express the role hierarchy
// here as well:
//
//   RoleCard              (base: renders the shared layout)
//     ├── UserCard
//     ├── StaffCard
//     └── AdminCard
//
// Subclasses override the polymorphic hooks `renderExtra` and `renderBody`
// (analogous to template-method pattern) — the base `render()` calls them, so
// each subclass contributes role-specific content without touching the layout.

export class RoleCard extends React.Component {
  renderExtra(/* role */) {
    return null;
  }

  renderBody(role) {
    return (
      <p className="text-sm text-slate-400">
        Permissions: {role.permissions.join(', ') || 'none'}
      </p>
    );
  }

  render() {
    const { user } = this.props;
    const role = createRole(user);

    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-lg ${role.color} text-white text-xl`}
          >
            {role.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{role.label}</span>
              <RoleBadge user={user} size="sm" showLabel={false} />
            </div>
            <div className="text-xs text-slate-500">{role.describe()}</div>
            {this.renderBody(role)}
          </div>
        </div>
        {this.renderExtra(role)}
      </div>
    );
  }
}

export class UserCard extends RoleCard {
  renderExtra() {
    return <span className="text-xs text-slate-500">Can edit own listings</span>;
  }
}

export class StaffCard extends RoleCard {
  renderExtra() {
    return (
      <span className="text-xs text-amber-400">Can manage users &amp; listings</span>
    );
  }
}

export class AdminCard extends RoleCard {
  renderExtra() {
    return (
      <span className="text-xs text-purple-400">Full system access</span>
    );
  }
}

export default RoleCard;
