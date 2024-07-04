import type { MutableRefObject } from 'react';
import { useRef } from 'react';
import useDisclosure from './useDisclosure';

type Props<T> = {
	anchorRef: MutableRefObject<T | null>;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
};

export const usePopover = <T = HTMLElement>(): Props<T> => {
	const anchorRef = useRef<T | null>(null);
	const disclosure = useDisclosure(false);

	return {
		anchorRef,
		...disclosure,
	};
};
