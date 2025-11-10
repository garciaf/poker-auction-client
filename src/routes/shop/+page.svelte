<script lang="ts">
  import socket from '$lib/socket';
  import Chip from '$lib/components/Chip.svelte';
  import SaleJoker from '$lib/components/SaleJoker.svelte';
  import { shopStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  function buyJoker(joker: any) {
    socket?.emit('buy', {key: joker.key,});
  }
</script>


<div class="layout-content space-y-8 p-4">
  <div class="max-w-lg mx-auto">
    <div class= "flex justify-between items-center mb-6 bg-black/20 rounded-xl p-4">
      <div class="text-5xl font-eight-bit uppercase tracking-wider">Shop</div>
      <div class="text-right">
        <Chip />
      </div>
    </div>
    
    {#each $shopStore.jokers as joker}
      <div class="bg-black/20 rounded-xl mb-5">
        <div class= "p-6">
          <div class="relative">
            <div class="flex flex-col item-center justify-center mb-6">
              <div class="absolute -top-10 -right-10 price-tag rounded-full w-20 h-20 flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="text-2xl font-eight-bit font-bold text-gray-800">{ joker.price }</div>
                  <div class="text-xs text-gray-700 font-eight-bit">{$t("common.chips")}</div>
                </div>
              </div>
              <div class="text-center mb-4">
                <h2 class="text-2xl font-eight-bit font-bold mb-1"> { joker.name}</h2>
                <div class="text-sm opacity-70 font-eight-bit"> { joker.description }</div>
              </div>
              <div class="flex justify-center">
                <SaleJoker
                  joker={ joker }
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          onclick={() => buyJoker(joker)}
          class="flex-[2] btn btn-primary"
          aria-label={$t('actions.submitBid')}
        >
          {$t('actions.buyFor', { price: joker.price })}
        </button>  
      </div>
    {/each}
  </div>
</div>

<style>
  .price-tag {
		background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
		box-shadow: 0 4px 8px rgba(0,0,0,0.3);
	}
</style>
