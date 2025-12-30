// Type declarations for the 'sonner' library
declare module "sonner" {
	import * as React from "react";
	export const Toaster: React.ComponentType<
		React.ComponentPropsWithoutRef<"div"> & { theme?: string }
	>;
	export function toast(message: string, options?: any): void;
	export function toastPromise(
		promise: Promise<any>,
		messages: { loading: string; success: string; error: string },
		options?: any,
	): void;
}
