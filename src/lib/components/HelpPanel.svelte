<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { isHelpPanelOpen } from '$lib/stores/help';
	import SmallCard from './SmallCard.svelte';
	import { t } from '$lib/i18n/index';

	function closePanel() {
		isHelpPanelOpen.set(false);
	}

	const pokerHands = [
		{
			key: 'royalFlush',
			cards: [
				{ suit: 'HEARTS', rank: 10 },
				{ suit: 'HEARTS', rank: 11 },
				{ suit: 'HEARTS', rank: 12 },
				{ suit: 'HEARTS', rank: 13 },
				{ suit: 'HEARTS', rank: 14 }
			]
		},
		{
			key: 'straightFlush',
			cards: [
				{ suit: 'SPADES', rank: 5 },
				{ suit: 'SPADES', rank: 6 },
				{ suit: 'SPADES', rank: 7 },
				{ suit: 'SPADES', rank: 8 },
				{ suit: 'SPADES', rank: 9 }
			]
		},
		{
			key: 'fourOfAKind',
			cards: [
				{ suit: 'HEARTS', rank: 11 },
				{ suit: 'DIAMONDS', rank: 11 },
				{ suit: 'CLUBS', rank: 11 },
				{ suit: 'SPADES', rank: 11 },
				{ suit: 'HEARTS', rank: 2 }
			]
		},
		{
			key: 'fullHouse',
			cards: [
				{ suit: 'HEARTS', rank: 13 },
				{ suit: 'DIAMONDS', rank: 13 },
				{ suit: 'CLUBS', rank: 13 },
				{ suit: 'SPADES', rank: 7 },
				{ suit: 'HEARTS', rank: 7 }
			]
		},
		{
			key: 'flush',
			cards: [
				{ suit: 'DIAMONDS', rank: 2 },
				{ suit: 'DIAMONDS', rank: 5 },
				{ suit: 'DIAMONDS', rank: 8 },
				{ suit: 'DIAMONDS', rank: 11 },
				{ suit: 'DIAMONDS', rank: 14 }
			]
		},
		{
			key: 'straight',
			cards: [
				{ suit: 'HEARTS', rank: 6 },
				{ suit: 'SPADES', rank: 7 },
				{ suit: 'DIAMONDS', rank: 8 },
				{ suit: 'CLUBS', rank: 9 },
				{ suit: 'HEARTS', rank: 10 }
			]
		},
		{
			key: 'threeOfAKind',
			cards: [
				{ suit: 'HEARTS', rank: 9 },
				{ suit: 'DIAMONDS', rank: 9 },
				{ suit: 'CLUBS', rank: 9 },
				{ suit: 'SPADES', rank: 3 },
				{ suit: 'HEARTS', rank: 12 }
			]
		},
		{
			key: 'twoPair',
			cards: [
				{ suit: 'HEARTS', rank: 10 },
				{ suit: 'DIAMONDS', rank: 10 },
				{ suit: 'CLUBS', rank: 6 },
				{ suit: 'SPADES', rank: 6 },
				{ suit: 'HEARTS', rank: 4 }
			]
		},
		{
			key: 'pair',
			cards: [
				{ suit: 'HEARTS', rank: 14 },
				{ suit: 'DIAMONDS', rank: 14 },
				{ suit: 'CLUBS', rank: 5 },
				{ suit: 'SPADES', rank: 8 },
				{ suit: 'HEARTS', rank: 11 }
			]
		},
		{
			key: 'highCard',
			cards: [
				{ suit: 'HEARTS', rank: 2 },
				{ suit: 'SPADES', rank: 5 },
				{ suit: 'DIAMONDS', rank: 8 },
				{ suit: 'CLUBS', rank: 12 },
				{ suit: 'HEARTS', rank: 14 }
			]
		}
	];
</script>

{#if $isHelpPanelOpen}
	<!-- Overlay -->
	<button
		class="fixed inset-0 bg-black/60 z-[9998]"
		transition:fade={{ duration: 200 }}
		onclick={closePanel}
		aria-label="Close help panel"
	/>

	<!-- Panel -->
	<div
		class="fixed top-0 right-0 h-dvh w-full sm:w-[500px] bg-poker-dark-green shadow-2xl z-[9999] overflow-auto"
		transition:fly={{ x: 500, duration: 300 }}
	>
		<!-- Header -->
		<div class="sticky top-0 bg-poker-darker-green px-6 py-4 flex justify-between items-center shadow-lg z-10">
			<h2 class="text-2xl font-eight-bit text-gold">{$t('help.title')}</h2>
			<button
				onclick={closePanel}
				class="text-white hover:text-gold transition-colors text-3xl leading-none font-eight-bit"
				aria-label="Close"
			>
				×
			</button>
		</div>

		<!-- Content -->
		<div class="p-6 space-y-6">
			<p class="font-eight-bit text-sm text-white/80 mb-8">
				{$t('help.description')}
			</p>

			{#each pokerHands as hand, index}
				<div class="bg-black/20 rounded-xl p-4 space-y-3">
					<!-- Rank badge -->
					<div class="flex items-center gap-3">
						<span class="bg-gold text-poker-darker-green font-eight-bit text-lg px-3 py-1 rounded-lg">
							{index + 1}
						</span>
						<h3 class="font-eight-bit text-xl text-white">
							{$t(`help.hands.${hand.key}.name`)}
						</h3>
					</div>

					<!-- Cards -->
					<div class="flex gap-2 justify-center py-2">
						{#each hand.cards as card}
							<SmallCard suit={card.suit} rank={card.rank} size="SMALL" />
						{/each}
					</div>

					<!-- Description -->
					<p class="font-eight-bit text-sm text-white/70 leading-relaxed">
						{$t(`help.hands.${hand.key}.description`)}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
