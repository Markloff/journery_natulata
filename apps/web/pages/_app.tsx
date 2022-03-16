import React from 'react';
import NextApp from 'next/app';

import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './styles/theme';

export default class App extends NextApp {

	render(): JSX.Element {
		const { Component, pageProps } = this.props;
		return (
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		)
	}
}
