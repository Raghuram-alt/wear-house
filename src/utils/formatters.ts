export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTimeRemaining(isoDateString: string): { text: string; isOverdue: boolean; isCritical: boolean } {
  const target = new Date(isoDateString).getTime();
  const now = new Date().getTime();
  const diffMs = target - now;

  if (diffMs <= 0) {
    const overdueMins = Math.abs(Math.floor(diffMs / 60000));
    return {
      text: `OVERDUE ${overdueMins}m`,
      isOverdue: true,
      isCritical: true,
    };
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const text = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const isCritical = totalMinutes < 120; // less than 2h remaining

  return {
    text,
    isOverdue: false,
    isCritical,
  };
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
