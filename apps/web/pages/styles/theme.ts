import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: Partial<ThemeConfig> = {
	useSystemColorMode: false,
	initialColorMode: 'light',
}

export const theme: ThemeConfig = extendTheme({ config })

