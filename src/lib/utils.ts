export function readLobbyIdFromUrl(): string {
  if (typeof window === 'undefined') return '';
  const href = window.location.href;
  const queryIndex = href.indexOf('?');
  if (queryIndex !== -1) {
    const queryString = href.substring(queryIndex + 1);
    const params = new URLSearchParams(queryString);
    return params.get('lobbyId') ?? '';
  }
  return '';
}
