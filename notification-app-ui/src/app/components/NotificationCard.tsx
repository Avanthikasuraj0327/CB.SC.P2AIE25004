import React from 'react';

export type Notification = {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
};

interface Props {
  notification: Notification;
  index: number;
}

const typeColors: Record<Notification['Type'], string> = {
  Placement: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  Result: 'bg-gradient-to-r from-green-600 to-emerald-600',
  Event: 'bg-gradient-to-r from-blue-600 to-cyan-600',
};

export const NotificationCard: React.FC<Props> = ({ notification, index }) => {
  const { ID, Type, Message, Timestamp } = notification;
  const formattedDate = new Date(Timestamp).toLocaleString();
  return (
    <div
      className={`flex items-center p-4 rounded-xl backdrop-blur-md shadow-lg transition-transform hover:scale-[1.02] ${typeColors[Type]}`}
      style={{ background: 'rgba(255,255,255,0.12)' }}
    >
      <div className="flex-1">
        <h3 className="text-sm font-medium text-white">{Message}</h3>
        <p className="text-xs text-white/70">{formattedDate}</p>
      </div>
      <div className="text-xs font-mono text-white/80 ml-2">#{index + 1}</div>
    </div>
  );
};
