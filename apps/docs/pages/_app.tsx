import 'nextra-theme-docs/style.css';
import '../styles/main.css';


export default function Nextra({ Component, pageProps }) {

	return (
		<>
			<Component {...pageProps} />
		</>
	);
}
