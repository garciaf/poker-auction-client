import { writable } from 'svelte/store';
import { browser } from '$app/environment'; // <- safe SvelteKit way to detect browser

export function localStorageStore(key: any, initialValue = {}) {
  // Initialize store with either stored value or the default
  const storedValue = browser
    ? (() => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : initialValue;
        } catch (e) {
          console.warn(`localStorageStore: Failed to parse key "${key}"`, e);
          return initialValue;
        }
      })()
    : initialValue;

  const store = writable(storedValue);

  // Only subscribe to localStorage when in the browser
  if (browser) {
    store.subscribe((value) => {
      if (value === undefined) return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`localStorageStore: Failed to set key "${key}"`, e);
      }
    });

    // Optional: sync changes across tabs
    window.addEventListener('storage', (event) => {
      if (event.key === key && event.newValue) {
        try {
          store.set(JSON.parse(event.newValue));
        } catch (e) {
          console.warn(`localStorageStore: Failed to parse storage event for "${key}"`, e);
        }
      }
    });
  }

  return {
    ...store,
    setProp: (prop: string, val: any) => {
      store.update((obj) => ({ ...obj, [prop]: val }));
    },
    removeProp: (prop: string) => {
      store.update((obj) => {
        const newObj = { ...obj };
        delete newObj[prop];
        return newObj;
      });
    },
    reset: () => {
      store.set(initialValue);
    },
  };
}
