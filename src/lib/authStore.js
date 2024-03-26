import { writable } from 'svelte/store';

const authUser = writable(undefined);

export { authUser };
