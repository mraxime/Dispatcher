/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	output: 'standalone',
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
