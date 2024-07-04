/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	output: 'standalone',
	// prevent oslo/password from getting bundled
	// TODO: find the equivalent for turbopack to be able to use --turbo
	webpack: (config) => {
		config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
		return config;
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/dashboard/profil',
				permanent: true,
			},
		];
	},
	modularizeImports: {
		'@mui/material': {
			transform: '@mui/material/{{member}}',
		},
		'@mui/icons-material': {
			transform: '@mui/icons-material/{{member}}',
		},
	},
};

export default nextConfig;
