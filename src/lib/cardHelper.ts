import { t } from '$lib/i18n';
export interface Card { suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' ; rank: number }
export const cardMappingSuit = {
  'HEARTS': 'Hearts',
  'DIAMONDS': 'Diamonds',
  'CLUBS': 'Clubs',
  'SPADES': 'Spades'
};

export const cardMappingRank: Record<number, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
};

export function cardName(card: Card): String {
  if (!card) return '';
  const rank = t.get(`cards.ranks.${card.rank}`);
	const suit = t.get(`cards.suits.${card.suit}`);
	const connector = t.get('cards.of');
	
  return `${rank} ${connector} ${suit}`;

}

export function cardNameByValue(rank: number, suit: string): string {
  if (!rank) return '';
  if (!suit) return '';
  const rankName = t.get(`cards.ranks.${rank}`);
	const suitName = t.get(`cards.suits.${suit}`);
	const connector = t.get('cards.of');
	
  return `${rankName} ${connector} ${suitName}`;

}