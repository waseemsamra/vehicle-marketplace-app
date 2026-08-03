// Role model: Object-Oriented design using class inheritance + polymorphism.
//
//   BaseRole
//     └── UserRole          (regular marketplace user)
//           ├── StaffRole   (privileged user, NOT a full admin)
//           └── AdminRole   (full system access)
//
// Each subclass overrides the polymorphic getters/methods (label, icon, color,
// permissions, canX...) so callers can treat every role uniformly through the
// BaseRole interface — e.g. `role.canViewAdmin()` does the right thing per subclass.
//
// The `createRole(user)` factory is the single entry point that returns the
// correct subclass instance based on the authenticated user's Cognito groups.

const SUPER_ADMIN = 'waseemsamra@gmail.com';

const getGroups = (user) => {
  if (!user) return [];
  try {
    return (
      user.signInUserSession?.accessToken?.payload['cognito:groups'] ||
      user.groups ||
      []
    );
  } catch {
    return user.groups || [];
  }
};

const getUsername = (user) => (user?.username ? String(user.username) : '');

export class BaseRole {
  constructor(user = null) {
    this.user = user;
  }

  // --- Identity (overridden by every subclass = polymorphism) ---
  get name() {
    return 'base';
  }
  get label() {
    return 'Role';
  }
  get icon() {
    return '❔';
  }
  get color() {
    return 'bg-slate-500';
  }

  // --- Authorisation contract (polymorphic) ---
  canViewAdmin() {
    return false;
  }
  canManageUsers() {
    return false;
  }
  canEditListings() {
    return false;
  }
  canDeleteListings() {
    return false;
  }

  get permissions() {
    return [];
  }

  // --- Presentation (polymorphic) ---
  describe() {
    const who = getUsername(this.user) || 'guest';
    return `${this.label} • ${who}`;
  }

  equals(other) {
    return other instanceof BaseRole && other.name === this.name;
  }
}

export class UserRole extends BaseRole {
  get name() {
    return 'user';
  }
  get label() {
    return 'User';
  }
  get icon() {
    return '👤';
  }
  get color() {
    return 'bg-blue-500';
  }

  canEditListings() {
    return true;
  }

  get permissions() {
    return ['listings:view', 'listings:create', 'listings:edit:own'];
  }

  describe() {
    return `User • ${getUsername(this.user) || 'guest'}`;
  }
}

export class StaffRole extends UserRole {
  get name() {
    return 'staff';
  }
  get label() {
    return 'Staff';
  }
  get icon() {
    return '⭐';
  }
  get color() {
    return 'bg-amber-500';
  }

  canManageUsers() {
    return true;
  }
  canEditListings() {
    return true;
  }
  canDeleteListings() {
    return true;
  }

  get permissions() {
    return [...super.permissions, 'listings:edit:any', 'support:tickets', 'users:manage'];
  }

  describe() {
    return `Staff • ${getUsername(this.user) || 'guest'}`;
  }
}

export class AdminRole extends UserRole {
  get name() {
    return 'admin';
  }
  get label() {
    return 'Admin';
  }
  get icon() {
    return '🛡️';
  }
  get color() {
    return 'bg-purple-600';
  }

  canViewAdmin() {
    return true;
  }
  canManageUsers() {
    return true;
  }
  canEditListings() {
    return true;
  }
  canDeleteListings() {
    return true;
  }

  get permissions() {
    return [
      ...super.permissions,
      'admin:view',
      'admin:manage',
      'users:manage',
      'listings:delete:any',
    ];
  }

  describe() {
    return `Admin • ${getUsername(this.user) || 'guest'}`;
  }
}

// Polymorphic factory: returns the matching subclass instance.
// Callers never branch on role name — they call the polymorphic methods.
export const createRole = (user = null) => {
  if (!user) return new BaseRole();

  const username = getUsername(user);
  const groups = getGroups(user);
  const roleClaim = user.role;

  if (
    roleClaim === 'admin' ||
    username === SUPER_ADMIN ||
    groups.includes('admin') ||
    username.toLowerCase().includes('admin')
  ) {
    return new AdminRole(user);
  }
  if (
    roleClaim === 'staff' ||
    groups.includes('staff') ||
    username.toLowerCase().includes('staff')
  ) {
    return new StaffRole(user);
  }
  return new UserRole(user);
};

// Convenience for pre-auth / local contexts (e.g. the login screen) where we
// only have a username, not a full Cognito user object.
export const createRoleFromUsername = (username) => createRole({ username });

export default BaseRole;
