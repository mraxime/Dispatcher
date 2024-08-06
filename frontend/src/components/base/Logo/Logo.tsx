import type { FC } from 'react';
import Image from 'next/image';

import logo from 'src/public/static/logo.png';

const Logo: FC = () => (
	<Image
		height={20}
		width={40}
		alt="Logo"
		src={logo}
		style={{
			maxWidth: '100%',
			height: 'auto',
		}}
	/>
);

export default Logo;
