import { Theme as ThemeType } from "theme-ui"
// theme-ui polaris preset
export const theme: ThemeType = {
	initialColorModeName: "Light",
	useColorSchemeMediaQuery: true,
	space: [0, 4, 8, 16, 32, 64, 128],
	breakpoints: ["512px", "768px", "1024px", "1280px"],
	radii: [0, 3, 6],
	shadows: {
		card: "0 0 4px rgba(0, 0, 0, .125)",
		sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
		md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		lg:
			"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
		xl:
			"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		"2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
		inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
		none: "none",
	},
	fonts: {
		body:
			'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
		heading:
			'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
		monospace: "Menlo, monospace",
	},
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
	fontWeights: {
		body: 400,
		heading: 600,
		bold: 700,
	},
	lineHeights: {
		body: 1.75,
		heading: 1.25,
	},
	// These are the default color names, but you can use your own or even nest them,
	// eg `red { light: "#xx1", med: "#xx2", dark: "#xx3" }, referenced as sx={{color: "red.med"}}
	colors: {
		background: "#fff",
		text: "#1b1e21",
		primary: "#51548C",
		secondary: "#49A68B",
		accent: "#F25270",
		highlight: "#73D99F",
		muted: "#eee",
		modes: {
			dark: {
				background: "#1b1e21",
				primary: "#49A68B",
				secondary: "#F25270",
				text: "#fff",
				muted: "#333",
				accent: "#D94848",
			},
		},
	},
	text: {
		heading: {
			fontFamily: "heading",
			fontWeight: "heading",
			lineHeight: "heading",
		},
		highlight: {
			bg: "highlight",
		},
	},
	buttons: {
		primary: {
			fontSize: 3,
			px: 3,
			py: 2,
			bg: "primary",
			color: "white",
			boxShadow: "none",
			borderRadius: "4px",
			border: "none",
			cursor: "pointer",
			outline: {
				bg: "white",
				color: "primary",
				borderColor: "primary",
				border: "3px solid",
			},
		},
	},
	styles: {
		root: {
			fontFamily: "body",
			lineHeight: "body",
			fontWeight: "body",
			// added only to demo the highlight text
			"*": {
				"::selection": {
					bg: "highlight",
					color: "text",
				},
			},
		},
		h1: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 5,
		},
		h2: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 4,
		},
		h3: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 3,
		},
		h4: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 2,
		},
		h5: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 1,
		},
		h6: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 0,
		},
		p: {
			color: "text",
			fontFamily: "body",
			fontWeight: "body",
			lineHeight: "body",
			code: {
				background: "black",
				color: "accent",
				borderRadius: 1,
				px: 1,
				fontFamily: "monospace",
				fontSize: "inherit",
			},
		},
		a: {
			color: "primary",
		},
		pre: {
			fontFamily: "monospace",
			overflowX: "auto",
			code: {
				color: "inherit",
			},
		},
		code: {
			background: "black",
			color: "accent",
			borderRadius: 1,
			px: 1,
			fontFamily: "monospace",
			fontSize: "inherit",
		},
		table: {
			width: "100%",
			borderCollapse: "separate",
			borderSpacing: 0,
		},
		th: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		td: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		img: {
			maxWidth: "100%",
		},
	},
}
