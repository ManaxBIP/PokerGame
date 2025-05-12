
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
	const getBestCard = (hand: any[]) => {
	  return Math.max(...hand.map(c => getHighCardValue(c.code)));
	};
  
	const playerBest = getBestCard([...player, ...community]);
	const ai1Best = getBestCard([...ai1, ...community]);
	const ai2Best = getBestCard([...ai2, ...community]);
  
	const max = Math.max(playerBest, ai1Best, ai2Best);
	const winners = [];
  
	if (playerBest === max) winners.push('Toi');
	if (ai1Best === max) winners.push('IA 1');
	if (ai2Best === max) winners.push('IA 2');
  
	return winners.length === 1
	  ? `${winners[0]} gagne avec ${max}`
	  : `Égalité entre ${winners.join(', ')} avec ${max}`;
  }
  