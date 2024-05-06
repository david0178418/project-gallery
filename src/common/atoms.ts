'use client';

import { ToastMesssage } from './types';

type LoadingCallback = (isLoading: boolean) => void;

class LoadingManager {
	private callback: LoadingCallback | null = null;

	subscribe(callback: LoadingCallback): void {
		this.callback = callback;
	}

	show() {
		this.callback?.(true);
	}

	hide() {
		this.callback?.(false);
	}
}

export const loadingManager = new LoadingManager();

type Foo = (message: ToastMesssage | null) => void;

class ToastManager {
	private queue: ToastMesssage[] = [];
	private callback: Foo | null = null;

	get currentMessage() {
		return this.queue[0] || null;
	}

	subscribe = (callback: Foo) => {
		this.callback = callback;

		this.callback(this.currentMessage);
	};

	unsubscribe = () => {
		this.callback = null;
	};

	pushMessage = (message: ToastMesssage | string) => {
		const addedMsg = (typeof message === 'string') ? { message } : message;

		this.queue.push(addedMsg);

		if(this.queue.length === 1) {
			this.callback?.(this.currentMessage);
		}
	};

	clearCurrentMessage = () => {
		this.queue.shift();

		this.callback?.(this.currentMessage);
	};
}

export const toastManager = new ToastManager();
