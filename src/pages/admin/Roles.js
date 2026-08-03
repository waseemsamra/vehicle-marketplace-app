import React from 'react';
import { createRole } from '../../models/Role';
import { UserCard, StaffCard, AdminCard } from '../../components/roles/RoleCard';
import RoleBadge from '../../components/roles/RoleBadge';

// Sample users used to demonstrate the role hierarchy. `groups` mirrors the
// Cognito `cognito:groups` claim so `createRole` resolves them polymorphically.
const SAMPLE_USERS = [
  { username: 'ali_rana', groups: ['user'], displayName: 'Ali Rana' },
  { username: 'sana_staff', groups: ['staff'], displayName: 'Sana Malik' },
  { username: 'admin@velociti.pk', displayName: 'Waseem Samra' },
];

const CARD_FOR_ROLE = {
  admin: AdminCard,
  staff: StaffCard,
  user: UserCard,
};

const Roles = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Roles</h1>
        <p className="text-gray-500 mt-1">
          Role-based access built on OOP inheritance + polymorphism (BaseRole
          &rarr; User / Staff / Admin).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_USERS.map((user) => {
          const Card = CARD_FOR_ROLE[createRole(user).name] || UserCard;

          return (
            <div key={user.username} className="space-y-3">
              <Card user={user} />
              <div className="flex items-center gap-2 pl-1">
                <RoleBadge user={user} />
                <span className="text-sm text-gray-500">{user.displayName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roles;
