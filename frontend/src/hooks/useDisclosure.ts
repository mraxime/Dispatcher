import { useMemo, useState } from 'react';

const useDisclosure = (initialOpen = false) => {
	const [state, setState] = useState<boolean>(initialOpen);

	const value = useMemo(
		() => ({
			isOpen: state,
			toggle: () => setState((value) => !value),
			open: () => setState(true),
			close: () => setState(false),
		}),
		[state],
	);

	return value;
};

export default useDisclosure;
