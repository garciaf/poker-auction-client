<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { isHelpPanelOpen } from '$lib/stores/help';
	import SmallCard from './SmallCard.svelte';
	import { t } from '$lib/i18n/index';

	let activeTab: 'poker' | 'auctions' = 'poker';

	function closePanel() {
		isHelpPanelOpen.set(false);
	}

	const pokerHands = [
		{
			key: 'royalFlush',
			cards: [
				{ suit: 'HEARTS' as const, rank: 10 },
				{ suit: 'HEARTS' as const, rank: 11 },
				{ suit: 'HEARTS' as const, rank: 12 },
				{ suit: 'HEARTS' as const, rank: 13 },
				{ suit: 'HEARTS' as const, rank: 14 }
			]
		},
		{
			key: 'straightFlush',
			cards: [
				{ suit: 'SPADES' as const, rank: 5 },
				{ suit: 'SPADES' as const, rank: 6 },
				{ suit: 'SPADES' as const, rank: 7 },
				{ suit: 'SPADES' as const, rank: 8 },
				{ suit: 'SPADES' as const, rank: 9 }
			]
		},
		{
			key: 'fourOfAKind',
			cards: [
				{ suit: 'HEARTS' as const, rank: 11 },
				{ suit: 'DIAMONDS' as const, rank: 11 },
				{ suit: 'CLUBS' as const, rank: 11 },
				{ suit: 'SPADES' as const, rank: 11 },
				{ suit: 'HEARTS' as const, rank: 2 }
			]
		},
		{
			key: 'fullHouse',
			cards: [
				{ suit: 'HEARTS' as const, rank: 13 },
				{ suit: 'DIAMONDS' as const, rank: 13 },
				{ suit: 'CLUBS' as const, rank: 13 },
				{ suit: 'SPADES' as const, rank: 7 },
				{ suit: 'HEARTS' as const, rank: 7 }
			]
		},
		{
			key: 'flush',
			cards: [
				{ suit: 'DIAMONDS' as const, rank: 2 },
				{ suit: 'DIAMONDS' as const, rank: 5 },
				{ suit: 'DIAMONDS' as const, rank: 8 },
				{ suit: 'DIAMONDS' as const, rank: 11 },
				{ suit: 'DIAMONDS' as const, rank: 14 }
			]
		},
		{
			key: 'straight',
			cards: [
				{ suit: 'HEARTS' as const, rank: 6 },
				{ suit: 'SPADES' as const, rank: 7 },
				{ suit: 'DIAMONDS' as const, rank: 8 },
				{ suit: 'CLUBS' as const, rank: 9 },
				{ suit: 'HEARTS' as const, rank: 10 }
			]
		},
		{
			key: 'threeOfAKind',
			cards: [
				{ suit: 'HEARTS' as const, rank: 9 },
				{ suit: 'DIAMONDS' as const, rank: 9 },
				{ suit: 'CLUBS' as const, rank: 9 },
				{ suit: 'SPADES' as const, rank: 3 },
				{ suit: 'HEARTS' as const, rank: 12 }
			]
		},
		{
			key: 'twoPair',
			cards: [
				{ suit: 'HEARTS' as const, rank: 10 },
				{ suit: 'DIAMONDS' as const, rank: 10 },
				{ suit: 'CLUBS' as const, rank: 6 },
				{ suit: 'SPADES' as const, rank: 6 },
				{ suit: 'HEARTS' as const, rank: 4 }
			]
		},
		{
			key: 'pair',
			cards: [
				{ suit: 'HEARTS' as const, rank: 14 },
				{ suit: 'DIAMONDS' as const, rank: 14 },
				{ suit: 'CLUBS' as const, rank: 5 },
				{ suit: 'SPADES' as const, rank: 8 },
				{ suit: 'HEARTS' as const, rank: 11 }
			]
		},
		{
			key: 'highCard',
			cards: [
				{ suit: 'HEARTS' as const, rank: 2 },
				{ suit: 'SPADES' as const, rank: 5 },
				{ suit: 'DIAMONDS' as const, rank: 8 },
				{ suit: 'CLUBS' as const, rank: 12 },
				{ suit: 'HEARTS' as const, rank: 14 }
			]
		}
	];

	const auctionTypes = [
		{
			key: 'openAuction',
			icon: '📢',
			color: '#D4AF37' // gold
		},
		{
			key: 'silentAuction',
			icon: '🤫',
			color: '#8B1538' // deep-crimson
		},
		{
			key: 'dutchAuction',
			icon: '⏬',
			color: '#FF8300' // dutch-orange
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

		<!-- Tab Navigation -->
		<div class="sticky top-[64px] bg-poker-dark-green px-6 py-3 flex gap-2 border-b-2 border-white/10 z-10">
			<button
				onclick={() => activeTab = 'poker'}
				class="flex-1 py-2 px-4 rounded-lg font-eight-bit text-sm transition-all {activeTab === 'poker' ? 'bg-gold text-poker-darker-green' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
			>
				{$t('help.tabs.poker')}
			</button>
			<button
				onclick={() => activeTab = 'auctions'}
				class="flex-1 py-2 px-4 rounded-lg font-eight-bit text-sm transition-all {activeTab === 'auctions' ? 'bg-gold text-poker-darker-green' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
			>
				{$t('help.tabs.auctions')}
			</button>
		</div>

		<!-- Content -->
		<div class="p-6 space-y-6">
			{#if activeTab === 'poker'}
				<p class="font-eight-bit text-sm text-white/80 mb-8">
					{$t('help.pokerDescription')}
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
			{:else if activeTab === 'auctions'}
				<p class="font-eight-bit text-sm text-white/80 mb-8">
					{$t('help.auctionsDescription')}
				</p>

				{#each auctionTypes as auction, index}
					<div class="bg-black/20 rounded-xl p-4 space-y-3">
						<!-- Auction header -->
						<div class="flex items-center gap-3">
							<span
								class="font-eight-bit text-lg px-3 py-1 rounded-lg text-poker-darker-green"
								style="background-color: {auction.color}"
							>
								{index + 1}
							</span>
							<div class="flex items-center gap-2">
								<span class="text-2xl">{auction.icon}</span>
								<h3 class="font-eight-bit text-xl text-white">
									{$t(`help.auctions.${auction.key}.name`)}
								</h3>
							</div>
						</div>

						<!-- Short description -->
						<p class="font-eight-bit text-sm text-white/90 italic">
							{$t(`help.auctions.${auction.key}.shortDesc`)}
						</p>

						<!-- Description -->
						<p class="font-eight-bit text-sm text-white/70 leading-relaxed">
							{$t(`help.auctions.${auction.key}.description`)}
						</p>

						<!-- How to play -->
						<div class="bg-white/5 rounded-lg p-3 mt-2">
							<h4 class="font-eight-bit text-xs text-gold mb-2">
								{$t('help.auctions.howToPlay')}
							</h4>
							<p class="font-eight-bit text-xs text-white/70 leading-relaxed whitespace-pre-line">
								{$t(`help.auctions.${auction.key}.howTo`)}
							</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}
