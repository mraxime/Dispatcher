import type { FC, ReactElement, ReactNode } from 'react';

type Props = {
	condition: boolean;
	wrapper: (children: ReactNode) => ReactElement;
	children: ReactNode;
};

/**
 * A component that conditionally wraps its children in a `Wrapper` Component based on a condition.
 */
const ConditionalWrapper: FC<Props> = ({ condition, wrapper, children }) => {
	return condition ? wrapper(children) : children;
};

export default ConditionalWrapper;
