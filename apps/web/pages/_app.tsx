import React from 'react';
import NextApp from 'next/app';

import { theme } from './styles/theme';
import dynamic from 'next/dynamic';
const ThemeProvider = dynamic(() => import("theme-ui").then((module) => module.ThemeProvider), { ssr: false })

export default class App extends NextApp {

	render(): JSX.Element {
		const { Component, pageProps } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		)
	}
}
