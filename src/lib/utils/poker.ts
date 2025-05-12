
export function getHighCardValue(code: string): number {
	const valueMap: Record<string, number> = {
	  '2': 2, '3': 3, '4': 4, '5': 5,
	  '6': 6, '7': 7, '8': 8, '9': 9,
	  '0': 10, J: 11, Q: 12, K: 13, A: 14
	};
  
	return valueMap[code[0]] || 0;
  }
  
  export function determineWinner(
    player: any[],
    ai1: any[],
    ai2: any[],
    community: any[]
  ): string {
    const scores = [];
  
    if (player.length) {
      const playerHand = evaluateHand([...player, ...community]);
      scores.push({ name: 'Toi', ...playerHand });
    }
    if (ai1.length) {
      const ai1Hand = evaluateHand([...ai1, ...community]);
      scores.push({ name: 'IA 1', ...ai1Hand });
    }
    if (ai2.length) {
      const ai2Hand = evaluateHand([...ai2, ...community]);
      scores.push({ name: 'IA 2', ...ai2Hand });
    }
  
    scores.sort((a, b) => b.score - a.score);
    console.log(scores);
    const best = scores[0];
    const ties = scores.filter(p => p.score === best.score);
  
    if (ties.length === 1) {
      return `${best.name} gagne avec ${best.hand.replace(/_/g, ' ')} !`;
    } else {
      const names = ties.map(t => t.name).join(', ');
      return `Égalité entre ${names} avec ${best.hand.replace(/_/g, ' ')}`;
    }
  }
  
  
  
  export function getRandomDecision(): 'check' | 'fold' {
    return Math.random() < 0.8 ? 'check' : 'fold';
  }

  export type PokerHand =
  | 'high_card'
  | 'one_pair'
  | 'two_pair'
  | 'three_of_a_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_of_a_kind'
  | 'straight_flush';

export const HAND_RANK: Record<PokerHand, number> = {
  high_card: 1,
  one_pair: 2,
  two_pair: 3,
  three_of_a_kind: 4,
  straight: 5,
  flush: 6,
  full_house: 7,
  four_of_a_kind: 8,
  straight_flush: 9
};

export function parseCards(cards: any[]) {
  return cards.map((card) => ({
    value: getHighCardValue(card.code),
    suit: card.suit,
    raw: card
  }));
}


export function evaluateHand(cards: any[]): { hand: PokerHand; score: number } {
    const parsed = parseCards(cards);
    const values = parsed.map(c => c.value).sort((a, b) => b - a);
    const suits = parsed.map(c => c.suit);
  
    const counts: Record<number, number> = {};
    for (const v of values) counts[v] = (counts[v] || 0) + 1;
  
    const isFlush = suits.filter(s => s === suits[0]).length >= 5;
  
    const uniqueVals = [...new Set(values)];
    let straightHigh = 0;
    for (let i = 0; i <= uniqueVals.length - 5; i++) {
      const seq = uniqueVals.slice(i, i + 5);
      if (seq[0] - seq[4] === 4) {
        straightHigh = seq[0];
        break;
      }
    }
  
    const hasStraight = straightHigh > 0;
    const countsArr = Object.entries(counts).map(([v, c]) => ({ value: +v, count: c }));
    countsArr.sort((a, b) => b.count - a.count || b.value - a.value);
  
    const [first, second] = countsArr;
  
    if (hasStraight && isFlush) return { hand: 'straight_flush', score: 800 + straightHigh };
    if (first?.count === 4) return { hand: 'four_of_a_kind', score: 700 + first.value };
    if (first?.count === 3 && second?.count >= 2) return { hand: 'full_house', score: 600 + first.value };
    if (isFlush) return { hand: 'flush', score: 500 + values[0] };
    if (hasStraight) return { hand: 'straight', score: 400 + straightHigh };
    if (first?.count === 3) return { hand: 'three_of_a_kind', score: 300 + first.value };
    if (first?.count === 2 && second?.count === 2) return { hand: 'two_pair', score: 200 + first.value };
    if (first?.count === 2) return { hand: 'one_pair', score: 100 + first.value };
    return { hand: 'high_card', score: values[0] };
  }
  