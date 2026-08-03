import React from 'react';
import { createRole } from '../../models/Role';

// Polymorphic presentational badge: the same component renders differently
// depending on the role instance returned by `createRole`. Subclasses override
// `color`/`label`/`icon`, so adding a new role automatically styles its badge.
const RoleBadge = ({ user, showLabel = true, size = 'md' }) => {
  const role = React.useMemo(() => createRole(user), [user]);

  const sizeCls =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${role.color} text-white ${sizeCls}`}
      title={role.describe()}
    >
      <span className="leading-none">{role.icon}</span>
      <span aria-hidden={!showLabel}>{showLabel && role.label}</span>
    </span>
  );
};

export default RoleBadge;
