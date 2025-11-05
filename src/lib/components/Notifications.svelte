<!-- src/components/Notifications.svelte -->
<script>
    import { base } from '$app/paths';
    import { notifications } from '$lib/stores/player';
</script>

<!-- Global notification live region, render this permanently at the end of the document -->
<div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end py-6 sm:items-start sm:p-6">
     <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    {#each $notifications as notification, index (notification)}
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5"> 
            <div class="flex items-center space-x-4 bg-gray-900 rounded py-2 px-4">
                <div class="ml-3 w-0 flex-1 text-white font-[420]">
                    {notification.message}
                </div>
                <div class="shrink-0 pt-0.5">
                    <img class="size-10 rounded-full" src={`${base}/images/auctionner.png`} alt="auctioneer">
                </div>
            </div>
        </div>
    {/each}
    </div>
</div>