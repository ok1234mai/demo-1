import { User } from '../types';

type UserSelectorProps = {
  users: User[];
  selectedUserId: string;
  onChange: (userId: string) => void;
};

export function UserSelector({ users, selectedUserId, onChange }: UserSelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      <span className="font-medium">Mock User</span>
      <select
        value={selectedUserId}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
      >
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.user_id} - {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
